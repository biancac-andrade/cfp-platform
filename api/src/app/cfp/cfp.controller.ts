import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { SpeakerDTO } from '@cfp-platform/shared-types';
import { CfpService } from './cfp.service';

@Controller('cfp')
export class CfpController {
  constructor(private readonly cfpService: CfpService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() speakerDto: SpeakerDTO): SpeakerDTO {
    return this.cfpService.create(speakerDto);
  }

  @Get()
  findAll(): SpeakerDTO[] {
    return this.cfpService.findAll();
  }
}
