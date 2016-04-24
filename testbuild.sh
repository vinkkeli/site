#!/bin/bash
(./build.sh && cd build/ && python -m SimpleHTTPServer 8080)