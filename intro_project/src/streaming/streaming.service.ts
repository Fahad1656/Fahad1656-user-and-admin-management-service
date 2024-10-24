import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RtcRole, RtcTokenBuilder } from 'agora-token';
import axios from 'axios';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStreamingDto } from './dto/create-streaming.dto';
import { UpdateStreamingDto } from './dto/update-streaming.dto';
import { TranscribeService  } from 'aws-sdk';
import * as AWS from 'aws-sdk';
import { StartTranscriptionJobRequest } from 'aws-sdk/clients/transcribeservice'

import {
  TranscribeClient,
  StartTranscriptionJobCommand,
  StartTranscriptionJobCommandInput,
  LanguageCode,
} from '@aws-sdk/client-transcribe';

@Injectable()
export class StreamingService {
  private transcribe: AWS.TranscribeService;
  private readonly APP_ID = process.env.AGORA_APP_ID;
  private readonly APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE;
  private readonly RECORDING_SECRET = process.env.AGORA_RECORDING_SECRET;
  private readonly CUSTOMER_ID = process.env.AGORA_CUSTOMER_ID;
  private transcribeClient: TranscribeClient;

  private readonly AGORA_API_BASE = 'https://api.agora.io/v1/apps';
  
  constructor(private prisma: PrismaService) {
    AWS.config.update({
      region: process.env.AWS_REGION, // e.g., 'us-east-1'
      accessKeyId: process.env.ACCESS_KEY,
      secretAccessKey: process.env.SECRET_KEY,
    });
    this.transcribe = new AWS.TranscribeService();
  }
  create(createStreamingDto: CreateStreamingDto) {
    return 'This action adds a new streaming';
  }
  async getPublisherToken(user: any) {
    const APP_ID = process.env.AGORA_APP_ID;
    const APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE;
    const CHANNEL_NAME = process.env.AGORA_CHANNEL_NAME;

    try {
      const role = RtcRole.SUBSCRIBER;
      const uid = 0;
      const expireTime = 3600; // 1 hour in seconds
      const currentTimestamp = Math.floor(Date.now() / 1000);
      const privilegeExpireTime = currentTimestamp + 3600 * 8;

      const token = RtcTokenBuilder.buildTokenWithUid(
        APP_ID,
        APP_CERTIFICATE,
        CHANNEL_NAME,
        uid, // Use the provided UID
        role,
        expireTime,
        privilegeExpireTime,
      );

      return {
        success: true,
        token: token,
        // Return the UID as part of the response
        message: 'Token generated successfully',
        channelName: CHANNEL_NAME,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error?.response?.message || error.message,
        },
        error?.status || HttpStatus.BAD_REQUEST,
      );
    }
  };

  async getSubscriberToken(user: any) {
    const APP_ID = process.env.AGORA_APP_ID;
    const APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE;
    const CHANNEL_NAME = process.env.AGORA_CHANNEL_NAME;

    try {
      const role = RtcRole.SUBSCRIBER;
      const uid = 0;
      const expireTime = 3600; // 1 hour in seconds
      const currentTimestamp = Math.floor(Date.now() / 1000);
      const privilegeExpireTime = currentTimestamp + 3600 * 8;

      const token = RtcTokenBuilder.buildTokenWithUid(
        APP_ID,
        APP_CERTIFICATE,
        CHANNEL_NAME,
        uid, // Use the provided UID
        role,
        expireTime,
        privilegeExpireTime,
      );

      return {
        success: true,
        token: token,
        uid: uid, // Return the UID as part of the response
        message: 'Token generated successfully',
        channelName: CHANNEL_NAME,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error?.response?.message || error.message,
        },
        error?.status || HttpStatus.BAD_REQUEST,
      );
    }
  };

  async acquireResource(payload: {
    cname: string;

    uid: string;

    clientRequest: any;
  }) {
    const url = `${this.AGORA_API_BASE}/${this.APP_ID}/cloud_recording/acquire`;

    console.log('Request URL:', url);
    console.log('Request Payload:', payload);
    console.log('Customer ID:', this.CUSTOMER_ID);

    // Generate Authorization header
    const authHeader = `Basic ${Buffer.from(`${this.CUSTOMER_ID}:${process.env.SECRET}`).toString('base64')}`;
    console.log('Authorization Header:', authHeader);

    try {
      const response = await axios.post(
        url,
        {
          cname: payload.cname,
          uid: payload.uid,
          clientRequest: payload.clientRequest,
        },
        {
          headers: {
            Authorization: authHeader,
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('Response Data:', response.data);

      const { resourceId } = response.data;

      return {
        success: true,
        resourceId: resourceId,
        uid: payload.uid,
        message: 'Resource acquired successfully',
      };
    } catch (error) {
      console.error('Error response:', error.response?.data); // Log error details
      throw new HttpException(
        {
          success: false,
          message: error?.response?.data?.message || error.message,
        },
        error?.response?.status || HttpStatus.BAD_REQUEST,
      );
    }
  };

  async startRecording(payload: {
    resource: string;

    channel: string;
    uid: string;
    token: string;
  }) {
    const url = `${this.AGORA_API_BASE}/${this.APP_ID}/cloud_recording/resourceid/${payload.resource}/mode/mix/start`;
    const authHeader = `Basic ${Buffer.from(`${this.CUSTOMER_ID}:${process.env.SECRET}`).toString('base64')}`;
    console.log('Authorization Header:', authHeader);

    try {
      console.log(url);

      const response = await axios.post(
        url,
        {
          cname: payload.channel,
          uid: payload.uid,

          clientRequest: {
            token: payload.token,
            recordingConfig: {
              channelType: 0, //0: communication channel,1:live broadcastChannel
              streamTypes: 0, //0:audio only,1:video only,2:both
              audioProfile: 1,
              videoStreamType: 0,
              maxIdleTime: 1200,
              subscribeVideoUids: [],
              subscribeAudioUids: ['#allstream#'],
              subscribeUidGroup: 0,
            },
            recordingFileConfig: {
              avFileType: ['hls', 'mp4'],
            },
            storageConfig: {
              vendor: 1,
              region: 8,
              bucket: process.env.BUCKET_NAME,
              accessKey: process.env.ACCESS_KEY,
              secretKey: process.env.SECRET_KEY,
              fileNamePrefix: ['directory1', 'directory2'],
            },
          },
        },
        {
          headers: {
            Authorization: authHeader,
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('Response:', response.data);

      return {
        success: true,
        ...response.data,
        message: 'Recording started successfully',
      };
    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        response: error.response
          ? {
              status: error.response.status,
              data: error.response.data,
            }
          : undefined,
      });

      throw new HttpException(
        {
          success: false,
          message: error?.response?.data?.message || error.message,
        },
        error?.response?.status || HttpStatus.BAD_REQUEST,
      );
    }
  };

  async stopRecording(payload: {
    channel: string;
    uid: string;

    mode: string; // Ensure 'mode' is either 'live' or 'individual'
    sid: string; // Session ID received from the startRecording API
    resourceId: string; // Resource ID received from the acquireResource API
  }) {
    // Construct the URL with mode included
    const url = `${this.AGORA_API_BASE}/${this.APP_ID}/cloud_recording/resourceid/${payload.resourceId}/sid/${payload.sid}/mode/${payload.mode}/stop`;

    // Create Authorization header
    const authHeader = `Basic ${Buffer.from(`${this.CUSTOMER_ID}:${process.env.SECRET}`).toString('base64')}`;
    console.log('Authorization Header:', authHeader);

    try {
      // Log the URL for debugging
      console.log('Request URL:', url);

      // Perform POST request to stop recording
      const response = await axios.post(
        url,
        {
          cname: payload.channel,
          uid: payload.uid,

          clientRequest: {},
        }, // Empty body for stop recording request
        {
          headers: {
            Authorization: authHeader,
            'Content-Type': 'application/json',
          },
        },
      );

      // Log the response for debugging
      console.log('Response:', response.data);

      return {
        success: true,
        ...response.data,
        message: 'Recording stopped successfully',
      };
    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        response: error.response
          ? {
              status: error.response.status,
              data: error.response.data,
            }
          : undefined,
      });

      throw new HttpException(
        {
          success: false,
          message: error?.response?.data?.message || error.message,
        },
        error?.response?.status || HttpStatus.BAD_REQUEST,
      );
    }
  };

  async TranscribeRecording(jobName: string, url: string) {
    const params = {
      TranscriptionJobName: jobName,
      LanguageCode: 'en-US', // Set the appropriate language code
      Media: {
        MediaFileUri: url,
      },
     
      OutputBucketName: process.env.BUCKET_NAME, // Specify your S3 output bucket
    };

    try {
      
      await this.transcribe.startTranscriptionJob(params).promise();

      
      let jobStatus;
      do {
        await new Promise((resolve) => setTimeout(resolve, 5000)); 
        const response = await this.transcribe
          .getTranscriptionJob({ TranscriptionJobName: jobName })
          .promise();
        jobStatus = response.TranscriptionJob;
      } while (jobStatus.TranscriptionJobStatus === 'IN_PROGRESS');

     
      if (jobStatus.TranscriptionJobStatus === 'COMPLETED') {
        
        const transcriptUri = jobStatus.Transcript.TranscriptFileUri;
        const transcriptResponse = await fetch(transcriptUri);
        const transcriptData = await transcriptResponse.json();
        return {
          succes:true,
         
          Transcripted_Text:transcriptData?.results.transcripts[0]?.transcript}; 
      } else {
        throw new Error(
          `Transcription job ended with status: ${jobStatus.TranscriptionJobStatus}`,
        );
      }
    } catch (error) {
      throw new Error(`Error starting transcription job: ${error.message}`);
    }
  };
}




 

