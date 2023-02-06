import { Controller, Post, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AllowAccess } from 'src/util/decorators/allowAccess';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/create-auth.dto';

@AllowAccess()
@ApiBearerAuth('Authorization')
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Sign in user' })
  @Post('sign-in')
  signIn(@Body() signInUser: SignInDto) {
    return this.authService.signIn(signInUser);
  }
}
