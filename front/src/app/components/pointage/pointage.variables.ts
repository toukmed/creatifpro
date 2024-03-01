export const columns = [
  {
    libelle: 'Nom',
    path: 'employe.nom',
  },
  {
    libelle: 'Prénom',
    path: 'employe.prenom',
  },
  {
    libelle: 'CIN',
    path: 'employe.cin',
  },
  {
    libelle: 'Type contrat',
    path: 'employe.typeContrat',
  },
  {
    libelle: 'Projet',
    path: 'employe.projet.nom',
  },
  {
    libelle: 'Jours travailles',
    path: 'totalJoursTravailles',
  },
  {
    libelle: 'Jours sup travailles',
    path: 'totalJoursSupTravailles',
  },
  {
    libelle: 'Tarif journalier',
    path: 'employe.tarifJournalier',
  },
  {
    libelle: 'Salaire mensuel',
    path: 'employe.salaireMensuel',
  },
];

export const detailcolumns = [
  {
    libelle: 'Jour pointage',
    path: 'jourPointage',
  },
  {
    libelle: 'Pointage',
    path: 'pointage',
  },
  {
    libelle: 'Poinatge supplémentaire',
    path: 'pointageSupplementaire',
  },
  {
    libelle: 'Projet',
    path: 'projet.nom',
  },
];
