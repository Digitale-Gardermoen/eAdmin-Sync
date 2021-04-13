const translateFields = {
  // eAdmin fields
  'sLoginID': 'sAMAccountName',
  'sName': 'displayName',
  'sEMail': 'mail',
  'sPhone1': 'telephoneNumber',
  'sPhone2': 'mobile',
  // AD fields
  'sAMAccountName': 'sLoginID',
  'displayName': 'sName',
  'mail': 'sEMail',
  'telephoneNumber': 'sPhone1',
  'mobile': 'sPhone2'
};

module.exports = translateFields;
