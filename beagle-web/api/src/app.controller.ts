import {
  Controller,
  Get,
  Res,
} from '@nestjs/common';
import { ApiImplicitQuery } from '@nestjs/swagger';

@Controller()
export class AppController {

  @Get()
  root(@Res() res) {
    res.sendFile('index.html');
  }
}