/**
 * What fields should be translated to and from both systems.
 * @var
 */
const translateFields = {
  // eAdmin fields
  'sLoginID': 'sAMAccountName',
  'sName': 'displayName',
  'sEMail': 'mail',
  'sPhone1': 'telephoneNumber',
  'sPhone2': 'mobile',
  'sCustomer': 'department',
  // AD fields
  'sAMAccountName': 'sLoginID',
  'displayName': 'sName',
  'mail': 'sEMail',
  'telephoneNumber': 'sPhone1',
  'mobile': 'sPhone2',
  'department': 'sCustomer'
};

module.exports = translateFields;
