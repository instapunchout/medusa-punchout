import jwt from 'jsonwebtoken'
import { projectConfig } from '../../medusa-config'

// Route for punchout autologin
// GET /punchout

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {

  const response = await fetch("https://punchout.cloud/proxy", {
      method: "POST",
      body: JSON.stringify({query: req.query }),
      headers: { "Content-Type": "application/json" },
    },
  );

  const loginData = await response.json();

  let loggedCustomer = await this.customerService_.retrieveRegisteredByEmail(loginData.email);

  // TODO
  if(!loggedCustomer) {
    // create new user with provided email
    throw new Error('Create new user with provided email not implemented')
    // assign new user to loggedCustomer
  }

  req.session.jwt_store = jwt.sign(
    { customer_id: loggedCustomer.id },
    projectConfig.jwt_secret!,
    { expiresIn: '30d' }
  )

  return res.redirect(loginData.redirect || '/');
  
}