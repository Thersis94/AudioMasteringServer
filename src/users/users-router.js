const express = require("express");
const path = require("path");
const UsersService = require("./users-service");
const fs = require("fs");

const directoryPath = `C:/Users/thers/AudioMastering/TestingFolder/`

const usersRouter = express.Router();
const jsonBodyParser = express.json();

usersRouter.post("/", jsonBodyParser, (req, res, next) => {
  const { password, user_name } = req.body;

  for (const field of ["user_name", "password"])
    if (!req.body[field])
      return res.status(400).json({
        error: `Missing '${field}' in request body`
      });

  const passwordError = UsersService.validatePassword(password);
  if (passwordError) return res.status(400).json({ error: passwordError });

  UsersService.hasUserWithUserName(req.app.get("db"), user_name)
    .then(hasUserWithUserName => {
      if (hasUserWithUserName)
        return res.status(400).json({ error: `Username already taken` });

      return UsersService.hashPassword(password).then(hashedPassword => {
        const newUser = {
          user_name,
          password: hashedPassword
        };

        fs.mkdir(directoryPath + newUser.user_name, function(err){
          if (err) {
              return console.error(err);
          }
          console.log("Directory created successfully!");
       });

        return UsersService.insertUser(req.app.get("db"), newUser).then(
          user => {
            res
              .status(201)
              .location(path.posix.join(req.originalUrl, `/${user.id}`))
              .json(UsersService.serializeUser(user));
          }
        );
      });
    })
    .catch(next);
});

module.exports = usersRouter;
