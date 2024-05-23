// const { isTokenValid } = require("../utils/token");

// const authenticateUser = async (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({ error: "Authentication token missing or invalid" });
//   }

//   const token = authHeader.split(" ")[1]; // Extract the token from the Authorization header

//   try {
   
//     const { firstName, lastName, userId, role } = isTokenValid({ token });
//     req.user = { firstName, lastName, userId, role };
   
//     next();
//   } catch (error) {
//     return res.status(401).json({ error: "Invalid authentication token" });
//   }
// };

// const authorizePermissions = (...roles) => {
//   return (req, res, next) => {
//     console.log(req.user);
//     if (!req.user || !roles.includes(req.user.role)) {
//       return res.status(403).json({ error: "Unauthorized access" });
//     }
//     next();
//   };
// };

// module.exports = {
//   authenticateUser,
//   authorizePermissions,
// };



const { isTokenValid } = require("../utils/token");

const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("No auth header or invalid format");
    return res.status(401).json({ error: "Authentication token missing or invalid" });
  }

  const token = authHeader.split(" ")[1]; // Extract the token from the Authorization header

  try {
   

    // Verify the token
    const decodedToken = isTokenValid({ token });
   

    // Extract user information from the decoded token
    const { firstName, lastName, userId, role } = decodedToken.user;
    

    // Set req.user with the extracted user information
    req.user = { firstName, lastName, userId, role };
   
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({ error: "Invalid authentication token" });
  }
};

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    console.log("req.user:", req.user);
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Unauthorized access" });
    }
    next();
  };
};

module.exports = {
  authenticateUser,
  authorizePermissions,
};

