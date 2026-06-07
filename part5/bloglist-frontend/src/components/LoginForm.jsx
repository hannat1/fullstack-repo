import { TextField, Button } from '@mui/material'

const LoginForm = ({
  handleLogin,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password,
}) => {
  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <div>
          <label>
            username:
            <TextField
              type="text"
              placeholder="username"
              value={username}
              onChange={handleUsernameChange}
            />
          </label>
        </div>
        <div>
          <label>
            password:
            <TextField
              type="password"
              placeholder="password"
              value={password}
              onChange={handlePasswordChange}
            />
          </label>
        </div>
        <Button type="submit" variant="contained">
          login
        </Button>
      </form>
    </div>
  )
}

export default LoginForm
