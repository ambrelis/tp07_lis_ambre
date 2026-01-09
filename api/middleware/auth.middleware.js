const jwt = require('jsonwebtoken');
const config = require('../config');
const SECRET_KEY = config.JWT_SECRET;

/**
 * Middleware d'authentification JWT
 * Vérifie la présence et la validité du token dans l'en-tête Authorization
 * Format attendu: "Bearer <token>"
 */
const authenticateToken = (req, res, next) => {
  try {
    console.log('🔐 Auth middleware - Headers:', req.headers['authorization']);
    console.log('🔐 Auth middleware - Cookies:', req.cookies);
    
    // 1. Récupérer le token depuis le header Authorization (prioritaire) ou le cookie (fallback)
    let token = null;
    
    // Priorité 1: Vérifier le header Authorization
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
      console.log('🔐 Token trouvé dans le header Authorization');
    }
    
    // Fallback: si pas de header, vérifier le cookie
    if (!token && req.cookies?.accessToken) {
      token = req.cookies.accessToken;
      console.log('🔐 Token trouvé dans le cookie');
    }
    
    console.log('🔐 Token found:', token ? 'YES' : 'NO');
    
    if (!token) {
      return res.status(401).json({ 
        message: 'Token manquant. Authentification requise.' 
      });
    }

    // 3. Vérifier et décoder le token
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ 
            message: 'Token expiré. Veuillez vous reconnecter.' 
          });
        }
        if (err.name === 'JsonWebTokenError') {
          return res.status(401).json({ 
            message: 'Token invalide.' 
          });
        }
        return res.status(401).json({ 
          message: 'Erreur lors de la vérification du token.' 
        });
      }

      // 4. Ajouter les infos de l'utilisateur à la requête
      req.user = decoded;
      next();
    });

  } catch (error) {
    console.error('Erreur dans le middleware d\'authentification:', error);
    res.status(500).json({ 
      message: 'Erreur serveur lors de l\'authentification' 
    });
  }
};

/**
 * Middleware pour vérifier les rôles utilisateur (optionnel)
 * @param {Array<string>} roles - Liste des rôles autorisés
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        message: 'Utilisateur non authentifié' 
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Accès refusé. Permissions insuffisantes.' 
      });
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRoles
};
