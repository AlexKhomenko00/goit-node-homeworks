const Avatar = require("avatar-builder");
const fs = require("fs").promises;
const path = require("path");

const avatar = Avatar.builder(
  Avatar.Image.margin(
    Avatar.Image.roundedRectMask(
      Avatar.Image.compose(
        Avatar.Image.randomFillStyle(),
        Avatar.Image.shadow(Avatar.Image.margin(Avatar.Image.cat(), 8), {
          blur: 5,
          offsetX: 2.5,
          offsetY: -2.5,
          color: "rgba(0,0,0,0.75)",
        })
      ),
      32
    ),
    8
  ),
  128,
  128
);

async function createAvatar(email) {
  const buffer = await avatar.create("gabriel");

  await fs.writeFile(`tmp/${email}.jpg`, buffer, (err) => {
    if (err) throw new Error();
  });

  return `${email}.jpg`;
}

module.exports = createAvatar;
