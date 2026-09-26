const express = require("express");
const router = express.Router();

const Member = require("../models/Member");

// ==========================================
// AUTH MIDDLEWARE
// ==========================================

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authentication required"
    });
  }

  next();
};

// ==========================================
// ADD MEMBER
// POST /api/members
// ==========================================

router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      memberId,
      name,
      email,
      phone,
      address,
      membershipType,
      membershipDate,
      expiryDate
    } = req.body;

    if (!memberId || !name || !email || !phone) {
      return res.status(400).json({
        message: "Member ID, name, email and phone are required"
      });
    }

    const existingMember = await Member.findOne({
      $or: [
        { memberId },
        { email: email.toLowerCase() }
      ]
    });

    if (existingMember) {
      return res.status(400).json({
        message: "Member ID or email already exists"
      });
    }

    const member = new Member({
      memberId,
      name,
      email,
      phone,
      address,
      membershipType,
      membershipDate,
      expiryDate
    });

    await member.save();

    res.status(201).json({
      message: "Member added successfully",
      member
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to add member",
      error: error.message
    });
  }
});

// ==========================================
// GET ALL MEMBERS
// GET /api/members
// ==========================================

router.get("/", authMiddleware, async (req, res) => {
  try {
    const { status, membershipType, search } = req.query;

    let filter = {};

    if (status) {
      filter.status = status;
    }

    if (membershipType) {
      filter.membershipType = membershipType;
    }

    if (search) {
      filter.$or = [
        { memberId: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } }
      ];
    }

    const members = await Member.find(filter).sort({
      createdAt: -1
    });

    res.json({
      count: members.length,
      members
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch members",
      error: error.message
    });
  }
});

// ==========================================
// GET SINGLE MEMBER
// GET /api/members/:id
// ==========================================

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        message: "Member not found"
      });
    }

    res.json({
      member
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch member",
      error: error.message
    });
  }
});

// ==========================================
// UPDATE MEMBER
// PUT /api/members/:id
// ==========================================

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const {
      memberId,
      name,
      email,
      phone,
      address,
      membershipType,
      membershipDate,
      expiryDate,
      status
    } = req.body;

    const member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        message: "Member not found"
      });
    }

    if (memberId && memberId !== member.memberId) {
      const duplicateMember = await Member.findOne({
        memberId,
        _id: { $ne: member._id }
      });

      if (duplicateMember) {
        return res.status(400).json({
          message: "Member ID already exists"
        });
      }

      member.memberId = memberId;
    }

    if (email && email.toLowerCase() !== member.email) {
      const duplicateEmail = await Member.findOne({
        email: email.toLowerCase(),
        _id: { $ne: member._id }
      });

      if (duplicateEmail) {
        return res.status(400).json({
          message: "Email already exists"
        });
      }

      member.email = email.toLowerCase();
    }

    if (name !== undefined) member.name = name;
    if (phone !== undefined) member.phone = phone;
    if (address !== undefined) member.address = address;
    if (membershipType !== undefined) {
      member.membershipType = membershipType;
    }
    if (membershipDate !== undefined) {
      member.membershipDate = membershipDate;
    }
    if (expiryDate !== undefined) {
      member.expiryDate = expiryDate;
    }
    if (status !== undefined) {
      member.status = status;
    }

    await member.save();

    res.json({
      message: "Member updated successfully",
      member
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update member",
      error: error.message
    });
  }
});

// ==========================================
// DELETE MEMBER
// DELETE /api/members/:id
// ==========================================

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        message: "Member not found"
      });
    }

    await Member.findByIdAndDelete(req.params.id);

    res.json({
      message: "Member deleted successfully"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete member",
      error: error.message
    });
  }
});

// ==========================================
// ACTIVATE MEMBER
// PATCH /api/members/:id/activate
// ==========================================

router.patch("/:id/activate", authMiddleware, async (req, res) => {
  try {
    const member = await Member.findByIdAndUpdate(
      req.params.id,
      { status: "active" },
      { new: true }
    );

    if (!member) {
      return res.status(404).json({
        message: "Member not found"
      });
    }

    res.json({
      message: "Member activated successfully",
      member
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to activate member",
      error: error.message
    });
  }
});

// ==========================================
// DEACTIVATE MEMBER
// PATCH /api/members/:id/deactivate
// ==========================================

router.patch("/:id/deactivate", authMiddleware, async (req, res) => {
  try {
    const member = await Member.findByIdAndUpdate(
      req.params.id,
      { status: "inactive" },
      { new: true }
    );

    if (!member) {
      return res.status(404).json({
        message: "Member not found"
      });
    }

    res.json({
      message: "Member deactivated successfully",
      member
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to deactivate member",
      error: error.message
    });
  }
});

// ==========================================
// EXPORT ROUTER
// ==========================================

module.exports = router;