import { Injectable } from '@nestjs/common';
import { EventDTO } from '@cfp-platform/shared-types';
import { randomUUID } from 'crypto';

@Injectable()
export class EventsService {
  private readonly events: EventDTO[] = [];

  create(eventDto: EventDTO): EventDTO {
    const record: EventDTO = { ...eventDto, id: eventDto.id || randomUUID() };
    this.events.push(record);
    return record;
  }

  findAll(): EventDTO[] {
    return this.events;
  }
}
