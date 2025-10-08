CREATE TABLE activites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titre VARCHAR(255) NOT NULL,
  description TEXT,
  commentaire TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE activite_lignes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  activite_id INT NOT NULL,
  resultat TEXT,
  activite TEXT,
  groupes_cibles TEXT,
  themes TEXT,
  date_debut DATE,
  date_fin DATE,
  lieux VARCHAR(255),
  sources_verification TEXT,
  FOREIGN KEY (activite_id) REFERENCES activites(id) ON DELETE CASCADE
);

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  telephone VARCHAR(30),
  password_hash VARCHAR(255) NOT NULL,
  reset_code VARCHAR(10) DEFAULT NULL,
  reset_expires DATETIME DEFAULT NULL,
  statut VARCHAR(20) NOT NULL DEFAULT 'inactif',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);