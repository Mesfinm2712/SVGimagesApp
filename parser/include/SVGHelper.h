/*Mebea Mesfin, mmesfin@uoguelph.ca, Student ID: 1045304*/

#include "SVGParser.h"
#include <libxml/xmlreader.h>

SVGimage* createSVG();
void print_element_names(xmlNode * a_node, SVGimage *svg);
char *readFile(const char* path);
Path *createPath();
void addPathData (Path *path, char *array);
Circle *createCircle();
Rectangle *createRectangle();
Group *createGroup();
Attribute *createAttribute();
void getAttributes (xmlNode *cur_node, SVGimage *svg);
void circleHelp(Group * g, List * circleList);
void rectHelp(Group * g, List * rectangleList);
void pathHelp(Group * g, List *pathList);
int groupELementCount(Group *g, int count);
void countGroupAttributes(List *groups, int length);
void findGroup(xmlNode * cur_node, Group *newGroup);
int processNode(int count, int gCounter, xmlTextReaderPtr reader);
int streamFile(int count, int gCounter, const char *filename);
int gCountFunc(int gCounter);
xmlDocPtr convertSVGToDoc(SVGimage * image);
bool writeRectNodes(SVGimage* img, xmlNodePtr root_node);
bool writePathNodes(SVGimage* img, xmlNodePtr root_node);
bool writeCircleNodes(SVGimage* img, xmlNodePtr root_node);
bool writeGroupNodes(SVGimage* img, xmlNodePtr root_node);
void circleWriteHelp(Group * g, xmlNodePtr root_node);
void pathWriteHelp(Group * g, xmlNodePtr root_node);
void rectWriteHelp(Group * g, xmlNodePtr root_node);
bool constraintsChecker(SVGimage *svg);
bool groupRect(ListIterator *var3);
bool groupPath(ListIterator *var5);
bool groupCircle(ListIterator *var1);
bool groupInGroup(ListIterator *var7);
int groupRecursiveRect(int numRect, Group *g);
int groupRecursivePath(int numPath, Group *g);
int groupRecursiveCirc(int numCirc, Group *g);
int groupRecursiveGroup(int numGroup, Group *g);
int breakString(char splitter,char ***pointer, const char *val);
char *createSVGFile(char *fileName);
char *uploadSVGFiles(char *fileName, int callFunction, char * editString);
char *fileToJSON(SVGimage *svg, char *fileName, int edit);
char *editAtt(char *fileName, char * oldAttName, char * attName, char*attVal, int val);
char * scaleImage(char * fileName, int scale, int val);









