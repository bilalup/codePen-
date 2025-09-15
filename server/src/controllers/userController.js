const User = require('../models/User');
const Project = require('../models/Project');

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Get user's public projects
    const projects = await Project.find({
      owner: user._id,
      isPublic: true
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        user,
        projects,
        projectsCount: projects.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    // Prevent changing sensitive fields
    const { password, email, ...updateData } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  getUserProfile,
  updateProfile
};