import { Injectable } from '@nestjs/common';
import { SpeakerDTO } from '@cfp-platform/shared-types';
import { randomUUID } from 'crypto';

@Injectable()
export class CfpService {
  private readonly speakers: SpeakerDTO[] = [];

  create(speakerDto: SpeakerDTO): SpeakerDTO {
    const record: SpeakerDTO = {
      ...speakerDto,
      id: speakerDto.id || randomUUID(),
    };
    this.speakers.push(record);
    return record;
  }

  submitProposal(speakerDto: SpeakerDTO): SpeakerDTO {
    return this.create(speakerDto);
  }

  findAll(): SpeakerDTO[] {
    return this.speakers;
  }
}
