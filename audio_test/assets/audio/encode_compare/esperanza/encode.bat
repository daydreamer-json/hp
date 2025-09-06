@echo off&chcp 65001&cd /d %~dp0&cls

opusenc --vbr --bitrate 6 --music --comp 10 --framesize 20 --max-delay 1000 original.flac opus_6.opus
opusenc --vbr --bitrate 8 --music --comp 10 --framesize 20 --max-delay 1000 original.flac opus_8.opus
opusenc --vbr --bitrate 12 --music --comp 10 --framesize 20 --max-delay 1000 original.flac opus_12.opus
opusenc --vbr --bitrate 16 --music --comp 10 --framesize 20 --max-delay 1000 original.flac opus_16.opus
opusenc --vbr --bitrate 20 --music --comp 10 --framesize 20 --max-delay 1000 original.flac opus_20.opus
opusenc --vbr --bitrate 24 --music --comp 10 --framesize 20 --max-delay 1000 original.flac opus_24.opus
opusenc --vbr --bitrate 32 --music --comp 10 --framesize 20 --max-delay 1000 original.flac opus_32.opus
opusenc --vbr --bitrate 40 --music --comp 10 --framesize 20 --max-delay 1000 original.flac opus_40.opus
opusenc --vbr --bitrate 48 --music --comp 10 --framesize 20 --max-delay 1000 original.flac opus_48.opus
opusenc --vbr --bitrate 56 --music --comp 10 --framesize 20 --max-delay 1000 original.flac opus_56.opus
opusenc --vbr --bitrate 64 --music --comp 10 --framesize 20 --max-delay 1000 original.flac opus_64.opus
opusenc --vbr --bitrate 80 --music --comp 10 --framesize 20 --max-delay 1000 original.flac opus_80.opus
opusenc --vbr --bitrate 96 --music --comp 10 --framesize 20 --max-delay 1000 original.flac opus_96.opus
opusenc --vbr --bitrate 128 --music --comp 10 --framesize 20 --max-delay 1000 original.flac opus_128.opus
opusenc --vbr --bitrate 192 --music --comp 10 --framesize 20 --max-delay 1000 original.flac opus_192.opus

ffmpeg -loglevel warning -i opus_6.opus -vn -c:a copy opus_6.webm
ffmpeg -loglevel warning -i opus_8.opus -vn -c:a copy opus_8.webm
ffmpeg -loglevel warning -i opus_12.opus -vn -c:a copy opus_12.webm
ffmpeg -loglevel warning -i opus_16.opus -vn -c:a copy opus_16.webm
ffmpeg -loglevel warning -i opus_20.opus -vn -c:a copy opus_20.webm
ffmpeg -loglevel warning -i opus_24.opus -vn -c:a copy opus_24.webm
ffmpeg -loglevel warning -i opus_32.opus -vn -c:a copy opus_32.webm
ffmpeg -loglevel warning -i opus_40.opus -vn -c:a copy opus_40.webm
ffmpeg -loglevel warning -i opus_48.opus -vn -c:a copy opus_48.webm
ffmpeg -loglevel warning -i opus_56.opus -vn -c:a copy opus_56.webm
ffmpeg -loglevel warning -i opus_64.opus -vn -c:a copy opus_64.webm
ffmpeg -loglevel warning -i opus_80.opus -vn -c:a copy opus_80.webm
ffmpeg -loglevel warning -i opus_96.opus -vn -c:a copy opus_96.webm
ffmpeg -loglevel warning -i opus_128.opus -vn -c:a copy opus_128.webm
ffmpeg -loglevel warning -i opus_192.opus -vn -c:a copy opus_192.webm

del *.opus

pause