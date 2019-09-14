---
layout: single
header:
  teaser: /assets/images/teasers/amazon-polly.png
title: "Convert Amazon Polly Audio(Speech Synthesis) Output From PCM to WAV"
date: 2019-08-11 12:00:00 -0800
categories: AWS
tags:
  - AWS Polly
  - Python
  - TTS
---
Check out how to convert Amazon Polly Audio from PCM to WAV format in Python.

## Amazon Polly Speech Synthesis
1) Amazon Polly Speech Synthesis method supports `json`, `mp3`, `ogg_vorbis` and `pcm` as output format which can be specified via OutputFormat parameter. For PCM output format, AWS Polly returns audio/pcm in a signed 16-bit, 1 channel (mono), little-endian format.  

2) Amazon Polly Speech Synthesis supports a few options of audio frequency in Hz which can be specified via `SampleRate` parameter. For PCM output format, available options are "8000" and "16000"(default).   

3) Amazon Polly Speech Synthesis request syntax according to AWS Polly documentation.    

<pre class='code'><code>
POST /v1/speech HTTP/1.1
Content-type: application/json

{
   "Engine": "string",
   "LanguageCode": "string",
   "LexiconNames": [ "string" ],
   "OutputFormat": "string",
   "SampleRate": "string",
   "SpeechMarkTypes": [ "string" ],
   "Text": "string",
   "TextType": "string",
   "VoiceId": "string"
}

</code></pre>

## What is PCM  
After reading about [WAV](https://en.wikipedia.org/wiki/WAV){:target="view_window"} and [PCM](https://en.wikipedia.org/wiki/Pulse-code_modulation){:target="view_window"} Wikipedia pages, I realized that WAV audio format is raw audio data in PCM format plus audio file headers.    

Quoted from Wiki, definition of PCM is as following:
> Pulse-code modulation (PCM) is a method used to digitally represent sampled analog signals. It is the standard form of digital audio in computers, compact discs, digital telephony and other digital audio applications.  

## Python Wave Module
Python `Wave` module provides an interface to WAV format. You can use it to convert PCM to WAV format by adding audio file headers through `setparams` and `writeframes` methods of a [Wave_write](https://docs.python.org/3/library/wave.html#wave-write-objects){:target="view_window"} object.  

Following are 'setparams' and 'writeframes' method signature and note according to Wave module documentation.      

**setparams**  
<pre class='code'><code>
Wave_write.setparams(tuple)   

The tuple should be   
(nchannels, sampwidth, framerate, nframes, comptype, compname),   
with values valid for the set*() methods. Sets all parameters.   

</code></pre>

**writeframes**  
<pre class='code'><code>
Wave_write.writeframes(data)   

Write audio frames and make sure nframes is correct.   
It will raise an error if the output stream is not seekable   
and the total number of frames that have been written after   
data has been written does not match the previously set value for nframes.  

writeframes() calculates the number of frames in the data and   
set nframes accordingly before writing the frame data.   

</code></pre>

## Convert PCM to WAV format  
Since PCM audio returned by AWS Polly is signed 16-bit, 1 channel (mono), in little-endian format and has a sample rate of 16000 Hz by default, the argument tuple for Wave_write's `setparams` method can have values as such:   

<pre class='code'><code>
(nchannels, sampwidth, framerate, nframes, comptype, compname)

nchannels = 1 (mono)
sampwidth = 16 // 8 (16 bits)
framerate = 16000 (16000 Hz)
nframes = 0 (let writeframes method handle it)
comptype = 'NONE' (not compressing for WAV)
compname = 'NONE' (not compressing for WAV)

</code></pre>

After setting params, you can use writeframes method sto write PCM data into a WAV file.  

Check out the code below that uses Amazon polly to synthesize speech via Boto3 and uses WAVE module to convert PCM output to WAV format. If you need to return binary data to frontend, you can use a Wave_read object to read WAV data from the WAV file.  

```python
import boto3
import wave

pollyClient = boto3.client('polly')
try:
  res = pollyClient.synthesize_speech(
          OutputFormat='pcm',
          Text='Test',
          TextType='text',
          VoiceId='Matthew'
        )

  if 'AudioStream' in response:
    wave_file_path = '/tmp/my-audio.wav'
    with wave.open(wave_file_path, 'wb') as wav_file:
      wav_file.setparams((1, 2, 16000, 0, 'NONE', 'NONE'))
      wav_file.writeframes(response['AudioStream'].read())
    
    # if you need wav in binary
    wav_data = None
    with wave.open(wave_file_path, 'rb') as wav_file:
      # get wav binary using read() method
      wav_data = wav_file.read()
  
    if os.path.exists(wave_file_path):
      os.unlink(wave_file_path)
    
    return wav_data
except Exception as e:
  print('synthesize_speech exception: ', e)
  return None
```

**Alternative to setparams**  
Instead of setparams method, you can use these 3 methods to set specific parameters for WAV audio.  

```python
wav_file.setnchannels(1) # nchannels
wav_file.setsampwidth(2) # sampwidth
wav_file.setframerate(16000) # framerate
```
## Summary
If you use Boto3 library to generate Amazon Polly audio and want output in WAV format and, you can use Python Wave module to convert PCM to WAV and return WAV binary to frontend.    

To learn how to configure API Gateway to return binary response, you can check out [Configuration for API Gateway Binary Response / Payloads](https://jun711.github.io/aws/aws-sam-configuration-for-api-gateway-binary-response/){:target="view_window"} article.   

{% include eof.md %}