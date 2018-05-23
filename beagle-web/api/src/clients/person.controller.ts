import {
  Controller,
  Get,
  Body,
  Post,
} from '@nestjs/common';
import { SignUpPersonDto } from './person.dto';
import { PersonService } from './person.service';

@Controller('beagle-web')
export class PersonController {

  constructor(private readonly personService: PersonService) { }

  @Post('auth/signup')
  async signUp(@Body() user: SignUpPersonDto): Promise<void> {
    await this.personService.signUp(user);
  }

  @Get('test')
  test(): string {
    return 'test';
  }

}