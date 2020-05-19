CFLAGS = -g -Wall -std=c11
FILE = FILE/
INC = include/
SRC = src/
FILE = ../
XML_PATH = /usr/include/libxml2


# Standard common makefile
parser: $(FILE)libsvgparse.so
#parser: $(FILE)libsvgparse.so main


$(FILE)libsvgparse.so: $(FILE)SVGParser.o $(FILE)LinkedListAPI.o
	gcc -shared -o $(FILE)libsvgparse.so $(FILE)SVGParser.o $(FILE)LinkedListAPI.o -lxml2 -lm

$(FILE)SVGParser.o: $(SRC)SVGParser.c $(INC)LinkedListAPI.h $(INC)SVGParser.h
	gcc -c -fpic $(CFLAGS) -I$(XML_PATH) -I$(INC) $(SRC)SVGParser.c -o $(FILE)SVGParser.o

$(FILE)LinkedListAPI.o: $(SRC)LinkedListAPI.c $(INC)LinkedListAPI.h
	gcc -c -fpic $(CFLAGS) -I$(INC) $(SRC)LinkedListAPI.c -o $(FILE)LinkedListAPI.o

#main: $(SRC)mainSvg.c
#	gcc $(CFLAGS) -I$(XML_PATH) -I$(INC) src/mainSvg.c -Wl,-rpath='${ORIGIN}' -L$(FILE) -lsvgparse -lxml2 -o $(FILE)main

#src/SVGHelper.c
#	gcc -Wall -std=c11 -I$(XML_PATH) -I$(INC) src/SVGHelper.c src/mainSv-g.c -L$(FILE) -lsvgparse -lxml2 -o $(FILE)main
#gcc `xml2-config --cflags --libs` -Wall -std=c11 -Iinclude -g src/LinkedListAPI.c src/SVGParser.c src/SVGHelper.c src/mainSvg.c -o main

#run:
#		cd FILE; ./main
clean:
	rm -rf $(FILE)*.o $(FILE)*.so
