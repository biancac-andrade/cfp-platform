import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { EventDTO } from '@cfp-platform/shared-types';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() eventDto: EventDTO): EventDTO {
    return this.eventsService.create(eventDto);
  }

  @Get()
  findAll(): EventDTO[] {
    return this.eventsService.findAll();
  }
}
