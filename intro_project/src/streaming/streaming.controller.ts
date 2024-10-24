import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { StreamingService } from './streaming.service';
import { CreateStreamingDto } from './dto/create-streaming.dto';
import { UpdateStreamingDto } from './dto/update-streaming.dto';
import { UserGuard } from 'src/common/user.gurad';
import { AuthGuard } from '@nestjs/passport';

@Controller('streaming')
export class StreamingController {
  constructor(private readonly streamingService: StreamingService) {}

  @Post()
  create(@Body() createStreamingDto: CreateStreamingDto) {
    return this.streamingService.create(createStreamingDto);
  }

  @Get('token')
  // @UseGuards(UserGuard)
  // @UseGuards(AuthGuard('jwt'))
  getPublisherToken(@Req() request) {
    const user = request.user;
    return this.streamingService.getPublisherToken(user);
  }
  @Get('subscriber/token')
  // @UseGuards(UserGuard)
  // @UseGuards(AuthGuard('jwt'))
  getSubscriberToken(@Req() request) {
    const user = request.user;
    return this.streamingService.getSubscriberToken(user);
  }

  @Post('acquire')
  acquireResource(
    @Body() payload: { cname: string; uid: string; clientRequest: any },
  ) {
    return this.streamingService.acquireResource(payload);
  }

  @Post('start')
  startRecording(
    @Body()
    payload: {
      resource: string;

      channel: string;
      uid: string;
      token: string;
    },
  ) {
    return this.streamingService.startRecording(payload);
  }

  @Post('stop')
  stopRecording(
    @Body()
    payload: {
      channel: string;
      uid: string;
      mode: string;
      sid: string; // Session ID received from the startRecording API
      resourceId: string; // Resource ID received from the acquireResource API
    },
  ) {
    return this.streamingService.stopRecording(payload);
  }

  @Post('transcribe')
  TranscribeRecording(
    @Body()
    payload: {
      url: string;
    },
  ) {
    const jobName = `transcription-${Date.now()}`; // Create a unique job name
    return this.streamingService.TranscribeRecording(jobName, payload.url);
  }
}

