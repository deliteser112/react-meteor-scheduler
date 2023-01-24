// ----------------------------------------------------------------------

const PRIMARY_NAME = ['A', 'N', 'H', 'L', 'Q', '9', '8'];
const INFO_NAME = ['F', 'G', 'T', 'I', 'J', '1', '2', '3'];
const SUCCESS_NAME = ['K', 'D', 'Y', 'B', 'O', '4', '5'];
const WARNING_NAME = ['P', 'E', 'R', 'S', 'C', 'U', '6', '7'];
const ERROR_NAME = ['V', 'W', 'X', 'M', 'Z'];

function getFirstCharacter(name) {
  if (name) {
    let twoChar = '';
    const tmpName = name.split(' ');
    if (tmpName[1][0]) {
      twoChar = `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`;
    } else {
      twoChar = `${name[0]}${name[1]}`;
    }
    return twoChar.toUpperCase();
  }
}

function getAvatarColor(name) {
  const firstChar = getFirstCharacter(name) && getFirstCharacter(name)[0];
  if (PRIMARY_NAME.includes(firstChar)) return 'primary';
  if (INFO_NAME.includes(firstChar)) return 'info';
  if (SUCCESS_NAME.includes(firstChar)) return 'success';
  if (WARNING_NAME.includes(firstChar)) return 'warning';
  if (ERROR_NAME.includes(firstChar)) return 'warning';
  return 'default';
}

export default function createAvatar(name) {
  return {
    name: getFirstCharacter(name),
    color: getAvatarColor(name)
  };
}
