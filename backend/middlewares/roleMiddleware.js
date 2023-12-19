import {ADMIN, USER} from "../constants/index.js"


const ROLES = {Admin: ADMIN, User: USER}

const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.user || !req?.roles) {
      res.status(401);
      throw new Error("You are not authorised to use this platform")
    }

    const rolesArr = [...allowedRoles]
    const roleFound = req.roles.map(role => rolesArr.includes(role)).find(item => item)

    if (!roleFound) {
      res.status(403);
      throw new Error("You are not authorised to perform this request")
    }

    next()
  }
}

const role = {ROLES, checkRole}

export default role