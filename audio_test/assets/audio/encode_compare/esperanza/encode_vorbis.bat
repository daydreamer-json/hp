@echo off&chcp 65001&cd /d %~dp0&cls

oggenc -b 6 --converter 0 original.flac -o vorbis_6.ogg
oggenc -b 8 --converter 0 original.flac -o vorbis_8.ogg
oggenc -b 12 --converter 0 original.flac -o vorbis_12.ogg
oggenc -b 16 --converter 0 original.flac -o vorbis_16.ogg
oggenc -b 20 --converter 0 original.flac -o vorbis_20.ogg
oggenc -b 24 --converter 0 original.flac -o vorbis_24.ogg
oggenc -b 32 --converter 0 original.flac -o vorbis_32.ogg
oggenc -b 40 --converter 0 original.flac -o vorbis_40.ogg
oggenc -b 48 --converter 0 original.flac -o vorbis_48.ogg
oggenc -b 56 --converter 0 original.flac -o vorbis_56.ogg
oggenc -b 64 --converter 0 original.flac -o vorbis_64.ogg
oggenc -b 80 --converter 0 original.flac -o vorbis_80.ogg
oggenc -b 96 --converter 0 original.flac -o vorbis_96.ogg
oggenc -b 128 --converter 0 original.flac -o vorbis_128.ogg
oggenc -b 192 --converter 0 original.flac -o vorbis_192.ogg

ffmpeg -loglevel warning -i vorbis_6.ogg -vn -c:a copy vorbis_6.webm
ffmpeg -loglevel warning -i vorbis_8.ogg -vn -c:a copy vorbis_8.webm
ffmpeg -loglevel warning -i vorbis_12.ogg -vn -c:a copy vorbis_12.webm
ffmpeg -loglevel warning -i vorbis_16.ogg -vn -c:a copy vorbis_16.webm
ffmpeg -loglevel warning -i vorbis_20.ogg -vn -c:a copy vorbis_20.webm
ffmpeg -loglevel warning -i vorbis_24.ogg -vn -c:a copy vorbis_24.webm
ffmpeg -loglevel warning -i vorbis_32.ogg -vn -c:a copy vorbis_32.webm
ffmpeg -loglevel warning -i vorbis_40.ogg -vn -c:a copy vorbis_40.webm
ffmpeg -loglevel warning -i vorbis_48.ogg -vn -c:a copy vorbis_48.webm
ffmpeg -loglevel warning -i vorbis_56.ogg -vn -c:a copy vorbis_56.webm
ffmpeg -loglevel warning -i vorbis_64.ogg -vn -c:a copy vorbis_64.webm
ffmpeg -loglevel warning -i vorbis_80.ogg -vn -c:a copy vorbis_80.webm
ffmpeg -loglevel warning -i vorbis_96.ogg -vn -c:a copy vorbis_96.webm
ffmpeg -loglevel warning -i vorbis_128.ogg -vn -c:a copy vorbis_128.webm
ffmpeg -loglevel warning -i vorbis_192.ogg -vn -c:a copy vorbis_192.webm

del *.ogg

pause