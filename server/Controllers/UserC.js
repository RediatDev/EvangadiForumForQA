const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {User} = require('../models');
const createUser = async (req, res) => {
    const {
      username, firstname, lastname, email, gender, country, agreed_to_terms, password
    } = req.body;
  
    const errors = [];
  
    // Helper function for input validation
    const validateInputs = () => {
      const trimmedUsername = username ? username.trim() : '';
      const trimmedFirstname = firstname ? firstname.trim() : '';
      const trimmedLastname = lastname ? lastname.trim() : '';
      const trimmedEmail = email ? email.trim() : '';
      const trimmedGender = gender ? gender.trim() : '';
      const trimmedCountry = country ? country.trim() : '';
      const trimmedAgreedToTerms = agreed_to_terms !== undefined ? agreed_to_terms : false;
      const trimmedPassword = password ? password.trim() : '';
  
      if (!trimmedUsername || !trimmedFirstname || !trimmedLastname || 
          !trimmedEmail || !trimmedGender || !trimmedCountry || 
          !trimmedAgreedToTerms || !trimmedPassword) {
        errors.push("All fields are required.");
      }
  
      if (!/^[A-Za-z]+$/.test(trimmedFirstname)) {
        errors.push("First name must contain letters only.");
      }
  
      if (!/^[A-Za-z]+$/.test(trimmedLastname)) {
        errors.push("Last name must contain letters only.");
      }
  
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
        errors.push("Invalid email format.");
      }
  
      if (trimmedAgreedToTerms === false) {
        errors.push("You must agree to the terms.");
      }
  
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/;
      if (!passwordRegex.test(trimmedPassword)) {
        errors.push("Password must be at least 6 characters long and include one uppercase letter, one lowercase letter, one number, and one special character.");
      }
  
      return {
        trimmedUsername,
        trimmedFirstname,
        trimmedLastname,
        trimmedEmail,
        trimmedGender,
        trimmedCountry,
        trimmedAgreedToTerms,
        trimmedPassword,
      };
    };
  
    const { trimmedUsername, trimmedFirstname, trimmedLastname, trimmedEmail, trimmedGender, trimmedCountry, trimmedAgreedToTerms, trimmedPassword } = validateInputs();
  
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
  
    try {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(trimmedPassword, salt);
  
      const user = await User.create({
        username: trimmedUsername,
        firstname: trimmedFirstname,
        lastname: trimmedLastname,
        email: trimmedEmail,
        gender: trimmedGender,
        country: trimmedCountry,
        agreed_to_terms: trimmedAgreedToTerms,
        password: hashPassword,
      });
  
      const token = jwt.sign(
        {
          userId: user.userid,
          userName: user.username,
          userRole: user.role,
        },
        process.env.JWT_SECRET_KEY, 
        { expiresIn: '3d' }
      );
  
      res.setHeader('Authorization', `Bearer ${token}`);
      return res.status(201).json({ token });
  
    } catch (err) {
      console.error("Error creating user:", err);
      if (err.name === "SequelizeValidationError") {
        const validationErrors = err.errors.map(e => e.message);
        return res.status(400).json({ errors: validationErrors });
      }
  
      return res.status(500).json({ errorMessage: "An internal server error occurred on creating user" });
    }
  };
  
  const userLogIn = async (req, res) => {
    const { email, password } = req.body;
  
    const errors = [];
  
    // Trim input values
    const trimmedEmail = email ? email.trim() : '';
    const trimmedPassword = password ? password.trim() : '';
  
    // Validation checks
    if (!trimmedEmail) errors.push("Email is required.");
    if (!trimmedPassword) errors.push("Password is required.");
  
    // If there are validation errors, respond with the errors
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
  
    try {
      // Find the user by email
      const user = await User.findOne({ where: { email: trimmedEmail } });
  
      // Check if user exists
      if (!user) {
        return res.status(401).json({ errors: ["Invalid email or password."] });
      }
  
      // Check if the password matches
      const isMatch = await bcrypt.compare(trimmedPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ errors: ["Invalid email or password."] });
      }
  
      // Generate JWT token
      const token = jwt.sign(
        {
          userId: user.userid,
          userName: user.username,
          userRole: user.role,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '3d' }
      );
  
      // Send response with token
      res.setHeader('Authorization', `Bearer ${token}`);
      return res.status(200).json({ token });
  
    } catch (err) {
      console.error("Error logging in user:", err);
      return res.status(500).json({ errors: ["Internal server error on logging in, please try again."] });
    }
  };
  

  const userProfileUpdate = async (req, res) => {
    const { userId } = req.params; 
    const { username, firstname, lastname, email, gender, country } = req.body;
  
    const errors = [];
  
    // Trim input values
    const trimmedUsername = username ? username.trim() : undefined;
    const trimmedFirstname = firstname ? firstname.trim() : undefined;
    const trimmedLastname = lastname ? lastname.trim() : undefined;
    const trimmedEmail = email ? email.trim() : undefined;
    const trimmedGender = gender ? gender.trim() : undefined;
    const trimmedCountry = country ? country.trim() : undefined;
  
    // Validation checks for required fields
    const isAnyFieldProvided = [trimmedUsername, trimmedFirstname, trimmedLastname, trimmedEmail, trimmedGender, trimmedCountry].some(field => field !== undefined);
    
    if (!isAnyFieldProvided) {
      errors.push("At least one field must be provided for update.");
    }
  
    // If there are validation errors, respond with the errors
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
  
    try {
      // Find the user by ID
      const user = await User.findByPk(userId);
  
      // Check if user exists
      if (!user) {
        return res.status(404).json({ errors: ["User not found."] });
      }
  
      // Update user information only for fields that are provided
      Object.assign(user, {
        username: trimmedUsername ?? user.username,
        firstname: trimmedFirstname ?? user.firstname,
        lastname: trimmedLastname ?? user.lastname,
        email: trimmedEmail ?? user.email,
        gender: trimmedGender ?? user.gender,
        country: trimmedCountry ?? user.country,
      });
  
      // Save the updated user to the database
      await user.save();
  
      // Respond with the updated user data
      return res.status(200).json({ message: "Profile updated successfully.", user });
  
    } catch (err) {
      console.error("Error updating user profile:", err);
      return res.status(500).json({ errors: ["Internal server error on updating user profile, please try again."] });
    }
  };
  
  const userRoleUpdater = async (req, res) => {
    const { userId } = req.params;
    const { role } = req.body;

    const errors = [];

    // List of valid roles
    const validRoles = ['0', '1', '2'];

    // Validation checks
    if (!role) {
        errors.push("Role is required.");
    } else if (!validRoles.includes(role)) { 
        errors.push("Invalid role provided.");
    }

    // If there are validation errors, respond with the errors
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    try {
        // Find the user by ID
        const user = await User.findByPk(userId);

        // Check if user exists
        if (!user) {
            return res.status(404).json({ errors: ["User not found."] });
        }

        // Update user role
        user.role = role;

        // Save the updated user to the database
        await user.save();

        // Remove sensitive information from the response
        const { password, ...updatedUser } = user.toJSON();

        // Respond with the updated user data
        return res.status(200).json({ message: "User role updated successfully.", user: updatedUser });

    } catch (err) {
        console.error("Error updating user role:", err);
        return res.status(500).json({ errors: ["Internal server error on user role updater"] });
    }
};

const userProfileDelete = async (req, res) => {
    const { userId } = req.params;

    // Validation checks
    if (!userId) {
        return res.status(400).json({ errors: ["User ID is required."] });
    }

    try {
        // Find the user by ID
        const user = await User.findByPk(userId);

        // Check if user exists
        if (!user) {
            return res.status(404).json({ errors: ["User not found."] });
        }

        // Hard delete
        await user.destroy();

        // Respond with a success message
        return res.status(200).json({ message: "User profile deleted successfully." });

    } catch (err) {
        console.error("Error deleting user profile:", err);
        return res.status(500).json({ errors: ["Internal server error upon deleting profile."] });
    }
};


const singleUserFinder = async (req, res) => {
    const { userId } = req.params;

    // Validation check
    if (!userId) {
        return res.status(400).json({ errors: ["User ID is required."] });
    }

    try {
        // Find the user by ID
        const user = await User.findByPk(userId);

        // Check if user exists
        if (!user) {
            return res.status(404).json({ errors: ["User not found."] });
        }

        // Exclude sensitive data from the response
        const { password, ...safeUserData } = user.toJSON();

        // Respond with the user data (excluding sensitive information)
        return res.status(200).json({ user: safeUserData });

    } catch (err) {
        console.error("Error finding user:", err);
        return res.status(500).json({ errors: ["Internal server error on getting single user, please try again later."] });
    }
};

const allUserFinder = async (req, res) => {
    try {
        // Fetch all users from the database, excluding sensitive fields like password
        const users = await User.findAll({
            attributes: { exclude: ['password'] }
        });

        // Respond with an empty array if no users are found, but still return 200 OK
        if (users.length === 0) {
            return res.status(200).json({ message: "No users found.", users: [] });
        }

        // Respond with the list of users
        return res.status(200).json({ users });

    } catch (err) {
        console.error("Error finding users:", err);
        return res.status(500).json({ errors: ["Internal server error while fetching all users."] });
    }
};




const userPasswordReset = async (req, res) => {
    const { userId } = req.params; 
    const { newPassword } = req.body;

    const errors = [];

    // Validation checks
    if (!userId) {
        errors.push("User ID is required.");
    }
    if (!newPassword) {
        errors.push("New password is required.");
    } else {
        // Password strength validation
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/;
        if (!passwordRegex.test(newPassword)) {
            errors.push("Password must be at least 6 characters long and include one uppercase letter, one lowercase letter, one number, and one special character.");
        }
    }

    // If there are validation errors, respond with the errors
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    try {
        // Find the user by ID
        const user = await User.findByPk(userId);

        // Check if user exists
        if (!user) {
            return res.status(404).json({ errors: ["User not found."] });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update user's password
        user.password = hashedPassword;

        // Save the updated user to the database
        await user.save();

        // Respond with a success message
        return res.status(200).json({ message: "Password updated successfully." });

    } catch (err) {
        console.error("Error resetting password:", err);
        return res.status(500).json({ errors: ["Internal server error on updating password."] });
    }
};


module.exports ={
    createUser,userLogIn,userProfileUpdate,userRoleUpdater,userProfileDelete,singleUserFinder,userPasswordReset,allUserFinder
}