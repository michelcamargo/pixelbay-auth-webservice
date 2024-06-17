import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignUpUserDto } from "./dto/signup-user.dto";
import { SignInUserDto } from "./dto/signin-user.dto";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  @Post('register')
  async signUpRouteHandler(@Body() userDto: SignUpUserDto) {
    console.log('SIGN UP >>', userDto);
    return this.authService.register(userDto);
  }

  @Post('login')
  async signInRouteHandler(@Body() userDto: SignInUserDto) {
    console.log('SIGN IN >>', userDto);
    
    return this.authService.login(userDto);
  }
}
