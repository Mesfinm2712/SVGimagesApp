/*Mebea Mesfin, mmesfin@uoguelph.ca, Student ID: 1045304*/
#include "SVGParser.h"
#include "SVGHelper.h"
#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <math.h>


char userG[25]; 
char passG[25]; 
char dataG[25];


char * credentials(char user[25], char pass[25], char data[25])
{
    strcpy(userG,user);
    strcpy(passG, pass);
    strcpy(dataG, data);

    // printf("credentials in c: %s\n\n", user);
    // printf("credentials in c: %s\n\n", pass);
    // printf("credential in cs: %s\n\n", data);

    return "{}";
}
char * returnCredentials()
{
    char * string = malloc(sizeof(char)*100);
    sprintf(string, "{\"user\":\"%s\",\"pass\":\"%s\",\"data\":\"%s\"}", userG, passG, dataG);

    // printf("returned credentials: %s\n\n", string);

    return string;

}
//helper to javascript
char *createSVGFile(char *fileName)
{

    if(fileName == NULL)
    {
        char * string = calloc(1, sizeof(char)*10);
        strcpy(string, "");
        return string;
    }
    SVGimage * svg = createSVGimage(fileName);
    bool check = validateSVGimage(svg, "./parser/svg.xsd");
    char * string = NULL;

    if(check)
    {
        string = SVGtoJSON(svg, fileName);
    }
        

    return string;
}
char * scaleImage(char * fileName, int scale, int val)
{
    if(fileName == NULL)
    {
        return NULL;
    }
    char *string = malloc(sizeof(char) * 100000);
    string = "{}";
    SVGimage * svg = createSVGimage(fileName);
    bool check = validateSVGimage(svg, "./parser/svg.xsd");


    if(check)
    {

        if(val == 0)
        {

            ListIterator iter = createIterator(svg->rectangles);


            ListIterator *var = &iter;
            Rectangle *rect = nextElement(var);

            while(rect != NULL)
            {

                // printf("rect width before: %f", rect->width);
                rect->width = rect->width * scale;
                rect->height = rect->height * scale;
                // printf("rect width before: %f", rect->width);

                rect = nextElement(var);
            }
            writeSVGimage(svg, fileName);

        }

        else if(val == 1)
        {

            ListIterator iter = createIterator(svg->circles);


            ListIterator *var = &iter;
            Circle *circ = nextElement(var);

            while(circ != NULL)
            {
                // printf("circ before: %f\n", circ->r);
                circ->r = circ->r * scale;
                // printf("circ after: %f\n", circ->r);
                // printf("scale: %d\n", scale);

                circ = nextElement(var);
            }
            writeSVGimage(svg, fileName);

        }
    }

    return string;
}
char *editAtt(char *fileName, char * oldAttName, char * attName, char*attVal, int val)
{
    // printf("in c function edit att\n");
    if(fileName == NULL)
    {
        return NULL;
    }
    char *string = malloc(sizeof(char) * 100000);
    SVGimage * svg = createSVGimage(fileName);
    bool check = validateSVGimage(svg, "./parser/svg.xsd");

    if(check)
    {

        if(val == 0)
        {

            ListIterator iter = createIterator(svg->otherAttributes);


            ListIterator *var = &iter;
            Attribute *att = nextElement(var);

            while(att != NULL)
            {
                if(strcmp(att->name, oldAttName) == 0)
                {
                    // printf("\t\t\tin here at c\n");
                    strcpy(att->name, attName);
                    strcpy(att->value, attVal);

                    writeSVGimage(svg, fileName);
                    string = "{}";     
                }
                att = nextElement(var);
            }
        }
        else if (val == 1)
        {
            Attribute *attAdd = createAttribute();
            strcpy(attAdd->name, attName);
            strcpy(attAdd->value, attVal);
            addComponent(svg, SVG_IMAGE, (void*)attAdd);
            writeSVGimage(svg, fileName);
            string = "{}";
        }
    }
    return string;     
        
}


char *uploadSVGFiles(char *fileName, int callFunction, char * editString)
{
    if(fileName == NULL)
    {
        return NULL;
    }
    SVGimage * svg = createSVGimage(fileName);
    bool check = validateSVGimage(svg, "./parser/svg.xsd");
    char * string = NULL;



    // rectListToJSON(svg->rectangles);


    string = malloc(sizeof(char) * 100000);

    if(check)
    {
        if (callFunction == 1)
        {
            string = SVGtoJSON(svg, fileName);
        }
        else if(callFunction == 2)
        {
            string = fileToJSON(svg, fileName, 0);
        }
        else if(callFunction == 3)
        {

            string = rectListToJSON(svg->rectangles);
            // printf("IN c, option rectangles: %s\n", string);
        }
        else if(callFunction == 4)
        {

            // printf("old title in c: %s", svg->title);
            char * oldTitle = malloc(sizeof(char) * 256);
            strcpy(oldTitle, svg->title);
            strncpy(svg->title,editString, 255);

            // printf("svg title in c: %s\n", svg->title);
            writeSVGimage(svg, fileName);

            char *string = malloc(sizeof(char)*(600));

            sprintf(string, "{\"file\":\"%s\",\"title\":\"%s\",\"desc\":\"%s\",\"oldTitle\":\"%s\"}", fileName, svg->title, svg->description, oldTitle);

            // string = fileToJSON(svg, fileName, 1);
            // printf("json in c for option 4 : %s\n", string);
            return string;


        }
        else if(callFunction == 5)
        {

            char * oldDesc = malloc(sizeof(char) * 256);
            strcpy(oldDesc, svg->title);

            strncpy(svg->description,editString, 255);
            writeSVGimage(svg, fileName);
            sprintf(string, "{\"file\":\"%s\",\"title\":\"%s\",\"desc\":\"%s\",\"oldDesc\":\"%s\"}", fileName, svg->title, svg->description, oldDesc);
            return string;

            // string = fileToJSON(svg, fileName, 1);

        }
        else if(callFunction == 6)//gets circs
        {
            string = circListToJSON(svg->circles);
            // printf("IN c, option circ: %s\n", string);
        }
        else if(callFunction == 7)//gets paths
        {
            string = pathListToJSON(svg->paths);
            // printf("IN c, option path: %s\n", string);
        }
        else if(callFunction == 8)
        {
            string = groupListToJSON(svg->groups);
            // printf("IN c, option group: %s\n", string);
        }
        else if (callFunction == 9)
        {
            string = attrListToJSON(svg->otherAttributes);
        }


    }
    if (callFunction == 10)//creates new file
    {
        // printf("in call func %s\n", editString);
        SVGimage * image = JSONtoSVG(editString);
        writeSVGimage(image, fileName);
        validateSVGimage(svg, "./parser/svg.xsd");  

        sprintf(string, "{\"file\":\"%s\",\"title\":\"%s\",\"desc\":\"%s\",\"numRect\":0,\"numCirc\":0,\"numPaths\":0,\"numGroups\":0}", fileName, image->title, image->description);

    }
    else if (callFunction == 11)
    {
        Rectangle * rect = JSONtoRect(editString);
        insertBack(svg->rectangles, (void*)rect);
        writeSVGimage(svg, fileName);
        string = "{}";

    }
    else if (callFunction == 12)
    {
        Circle * circ = JSONtoCircle(editString);
        insertBack(svg->circles, (void*)circ);
        writeSVGimage(svg, fileName);
        string = "{}";

    }


    return string;
}

char *fileToJSON(SVGimage *svg, char *fileName, int edit)
{

    char *string = malloc(sizeof(char)*(500));

    sprintf(string, "{\"file\":\"%s\",\"title\":\"%s\",\"desc\":\"%s\"}", fileName, svg->title, svg->description);


    return string;
}

//bonus
int breakString(char splitter,char ***pointer, const char *val)
{
    int count = 1;
    char **arr, *string = (char *) val;
    int *num, *value; 

    while(*string != '\0')if (*string++ == splitter) count += 1;
    {

        value = calloc (count, sizeof (int));
        num = value;
    }
    for (string = (char *) val; *string != '\0'; string++)
    {

        (*num)++;
    }

    arr = malloc (count * sizeof (char *));
    num = value;
    *pointer = arr;
    string = *arr++ = calloc (*(num++) + 1, sizeof (char *));
    while (*val != '\0')
    {
        if (*val != splitter)
        {
            *string++ = *val++;
        }
        else
        {
            string = *arr++ = calloc (*(num++) + 1, sizeof (char *));
            val++;
        }
    }
    free (value);

    return count;
}
SVGimage* JSONtoSVG(const char* svgString)//bonus
{

    if(svgString == NULL)
    {
        return NULL;
    }
    SVGimage * svg = NULL;
    svg = createSVG();

    //refactor below code
    char **string = NULL;
    int i = 0, total = 0;



    total = breakString('\"', &string, svgString);

    for (i = 0; i < total; i++)
    {

        if(i == 3)
        {
            strcpy(svg->title, string[i]);//adds title
        }
        if(i == 7)
        {
            strcpy(svg->description, string[i]);//adds description
        }
    }



    for (i = 0; i < total; i++)
    {
        free (string[i]);
    }
    free (string);

    strcpy(svg->namespace, "http://www.w3.org/2000/svg");//add the namespace


    return svg;
}
Rectangle *JSONtoRect(const char* svgString)//bonus
{
    if(svgString == NULL)
    {
        return NULL;
    }
    Rectangle * rect = createRectangle();

    char **string = NULL;

    int i = 0, total = 0;
    total = breakString('\"', &string, svgString);


    for (i = 0; i < total; i++)
    {

        if(i == 2)
        {

            char *value;
            float temp  = 0;
           
            value = strtok(string[i], ",");

            while( value != NULL ) 
            {

                value = strtok(NULL, ",");        

            }

            char * singleVal = strtok(string[i], ":");
            temp = atof(singleVal);
            rect->x = temp;
            // printf( "float x: %f\n", rect->x);
           
        }
        if(i == 4)
        {

            char *value;
            float temp  = 0;
           
            value = strtok(string[i], ",");

            while( value != NULL ) 
            {

                value = strtok(NULL, ",");        

            }

            char * singleVal = strtok(string[i], ":");
            temp = atof(singleVal);
            rect->y = temp;
            // printf( "float y: %f\n", rect->y);
           
        }
        if(i == 6)
        {

            char *value;
            float temp  = 0;
           
            value = strtok(string[i], ",");

            while( value != NULL ) 
            {

                value = strtok(NULL, ",");        

            }

            char * singleVal = strtok(string[i], ":");
            temp = atof(singleVal);
            rect->width = temp;
            // printf( "float width: %f\n", rect->width);
           
        }
        if(i == 8)
        {

            char *value;
            float temp  = 0;
           
            value = strtok(string[i], ",");

            while( value != NULL ) 
            {

                value = strtok(NULL, ",");        

            }

            char * singleVal = strtok(string[i], ":");
            temp = atof(singleVal);
            rect->height = temp;
            // printf( "float height: %f\n", rect->height);
           
        }
        if(i == 11)
        {

            char *value;
            // float temp  = 0;
           
            value = strtok(string[i], ":");

            while( value != NULL ) 
            {

                value = strtok(NULL, ":");        

            }

            strcpy(rect->units, string[i]);
            // printf( "units: %s\n", rect->units);

           
        }


    }


    // Attribute *att = createAttribute();

    // strcpy(att->name, "");
    // strcpy(att->value, "");

    // insertBack(rect->otherAttributes, (void *)att);
    

    for (i = 0; i < total; i++)
    {
        free (string[i]);
    }
    free (string);

    return rect;
}
Circle *JSONtoCircle(const char*svgString)//bonus
{
    if(svgString == NULL)
    {
        return NULL;
    }

    // printf("String: %s\n", svgString);
    Circle * circ = createCircle();

    char **string = NULL;

    int i = 0, total = 0;
    total = breakString('\"', &string, svgString);

    // total = breakString(svgString, '\"', &string);

    for (i = 0; i < total; i++)
    {

        if(i == 2)
        {

            char *value;
            float temp  = 0;
           
            value = strtok(string[i], ",");

            while( value != NULL ) 
            {

                value = strtok(NULL, ",");        

            }

            char * singleVal = strtok(string[i], ":");
            temp = atof(singleVal);
            circ->cx = temp;
            // printf( "float cx: %f\n", circ->cx);
           
        }
        if(i == 4)
        {

            char *value;
            float temp  = 0;
           
            value = strtok(string[i], ",");

            while( value != NULL ) 
            {

                value = strtok(NULL, ",");        

            }

            char * singleVal = strtok(string[i], ":");
            temp = atof(singleVal);
            circ->cy = temp;
            // printf( "float cy: %f\n", circ->cy);
           
        }
        if(i == 6)
        {

            char *value;
            float temp  = 0;
           
            value = strtok(string[i], ",");

            while( value != NULL ) 
            {

                value = strtok(NULL, ",");        

            }

            char * singleVal = strtok(string[i], ":");
            temp = atof(singleVal);
            circ->r = temp;
            // printf( "float r: %f\n", circ->r);
           
        }
        if(i == 9)
        {

            char *value;
            // float temp  = 0;
           
            value = strtok(string[i], ":");

            while( value != NULL ) 
            {

                value = strtok(NULL, ":");        

            }

            strcpy(circ->units, string[i]);
            // printf( "units: %s\n", circ->units);

           
        }


    }

    // Attribute *att = createAttribute();

    // strcpy(att->name, "");
    // strcpy(att->value, "");

    // insertBack(circ->otherAttributes, (void *)att);


    for (i = 0; i < total; i++)
    {
        free (string[i]);
    }
    free (string);

    return circ;
}




//module 2 functions below
void addComponent(SVGimage* image, elementType elemType, void* newComponent)
{
    if(image == NULL)
    {
    	return;
    }

    switch (elemType)
    {
        case SVG_IMAGE: ;

            insertBack(image->otherAttributes, (void*)newComponent);
            break;
        case CIRC: ;
            ListIterator iter23 = createIterator(image->circles);
            ListIterator *var23 = &iter23;
            Circle *circ = nextElement(var23);
            insertBack(circ->otherAttributes, (void*)newComponent);
        	break;
        case RECT: ;

            ListIterator iter24 = createIterator(image->rectangles);
            ListIterator *var24 = &iter24;
            Rectangle *rect = nextElement(var24);
			insertBack(rect->otherAttributes, (void*)newComponent);
        	break;
        case PATH: ;
            ListIterator iter25 = createIterator(image->paths);
            ListIterator *var25 = &iter25;
            Path *path = nextElement(var25);
            insertBack(path->otherAttributes, (void*)newComponent);
        	break;
        case GROUP: ;
            ListIterator iter26 = createIterator(image->groups);
            ListIterator *var26 = &iter26;
            Group *group = nextElement(var26);
            insertBack(group->otherAttributes, (void*)newComponent);
        	break;
	}

}

void setAttribute(SVGimage* image, elementType elemType, int elemIndex, Attribute* newAttribute)//sets an attribute
{
    if(image == NULL)
    {
        return ;
    }

    int counter = 0;



    switch (elemType)
    {
        case SVG_IMAGE: ;

            ListIterator iter23 = createIterator(image->otherAttributes);
            ListIterator *var23 = &iter23;
            Attribute *newAtt = nextElement(var23);

            if(strcmp(newAttribute->name, "viewBox") == 0)
            {

                while(newAtt != NULL)
                {


                    if(strcmp(newAtt->name, "viewBox") == 0)
                    {

                        strcpy(newAtt->name, "viewBox");//replace it 
                        strcpy(newAtt->value, newAttribute->value);//replace it 
                        return;

                    }
                    newAtt = nextElement(var23);
                }
                            
                Attribute *attAdd = createAttribute();
                strcpy(attAdd->name, newAttribute->name);
                strcpy(attAdd->value, newAttribute->value);
                addComponent(image, SVG_IMAGE, (void*)attAdd);


                return;

            }
            if(strcmp(newAttribute->name, "width") == 0)
            {

                while(newAtt != NULL)
                {


                    if(strcmp(newAtt->name, "width") == 0)
                    {
                        strcpy(newAtt->name, "width");//replace it 
                        strcpy(newAtt->value, newAttribute->value);//replace it 
                        return;

                    }
                    newAtt = nextElement(var23);
                }
                    
                Attribute *attAdd = createAttribute();
                strcpy(attAdd->name, newAttribute->name);
                strcpy(attAdd->value, newAttribute->value);
                addComponent(image, SVG_IMAGE, (void*)attAdd);


                return;

            }
            if(strcmp(newAttribute->name, "stroke-width") == 0)
            {

                while(newAtt != NULL)
                {


                    if(strcmp(newAtt->name, "stroke-width") == 0)
                    {
                        strcpy(newAtt->name, "stroke-width");//replace it 
                        strcpy(newAtt->value, newAttribute->value);//replace it 
                        return;

                    }
                    newAtt = nextElement(var23);
                }
                    
                Attribute *attAdd = createAttribute();
                strcpy(attAdd->name, newAttribute->name);
                strcpy(attAdd->value, newAttribute->value);
                addComponent(image, SVG_IMAGE, (void*)attAdd);


                return;

            }
            if(strcmp(newAttribute->name, "xmlns") == 0)
            {

                while(newAtt != NULL)
                {


                    if(strcmp(newAtt->name, "xmlns") == 0)
                    {
                        strcpy(newAtt->name, "xmlns");//replace it 
                        strcpy(newAtt->value, newAttribute->value);//replace it 
                        return;

                    }
                    newAtt = nextElement(var23);
                }
                    
                Attribute *attAdd = createAttribute();
                strcpy(attAdd->name, newAttribute->name);
                strcpy(attAdd->value, newAttribute->value);
                addComponent(image, SVG_IMAGE, (void*)attAdd);


                return;

            }
            if(strcmp(newAttribute->name, "version") == 0)
            {

                while(newAtt != NULL)
                {


                    if(strcmp(newAtt->name, "version") == 0)
                    {
                        strcpy(newAtt->name, "version");//replace it 
                        strcpy(newAtt->value, newAttribute->value);//replace it 
                        return;

                    }
                    newAtt = nextElement(var23);
                }
                    
                Attribute *attAdd = createAttribute();
                strcpy(attAdd->name, newAttribute->name);
                strcpy(attAdd->value, newAttribute->value);
                addComponent(image, SVG_IMAGE, (void*)attAdd);


                return;

            }
            if(strcmp(newAttribute->name, "height") == 0)
            {

                while(newAtt != NULL)
                {


                    if(strcmp(newAtt->name, "height") == 0)
                    {
                        strcpy(newAtt->name, "height");//replace it 
                        strcpy(newAtt->value, newAttribute->value);//replace it 
                        return;

                    }
                    newAtt = nextElement(var23);
                }
                    
                Attribute *attAdd = createAttribute();
                strcpy(attAdd->name, newAttribute->name);
                strcpy(attAdd->value, newAttribute->value);
                addComponent(image, SVG_IMAGE, (void*)attAdd);


                return;

            } 
            if(strcmp(newAttribute->name, "enable-background") == 0)
            {

                while(newAtt != NULL)
                {


                    if(strcmp(newAtt->name, "enable-background") == 0)
                    {
                        strcpy(newAtt->name, "enable-background");//replace it 
                        strcpy(newAtt->value, newAttribute->value);//replace it 
                        return;

                    }
                    newAtt = nextElement(var23);
                }
                    
                Attribute *attAdd = createAttribute();
                strcpy(attAdd->name, newAttribute->name);
                strcpy(attAdd->value, newAttribute->value);
                addComponent(image, SVG_IMAGE, (void*)attAdd);


                return;

            }            



            break;

        case CIRC: ;

        	if(elemIndex < 0)
        	{
        		return;
        	}


            ListIterator iter1 = createIterator(image->circles);

            ListIterator *var1 = &iter1;
            Circle *circle = nextElement(var1);

            while(circle != NULL)
            {

               	if(counter == elemIndex)
               	{


	            	//check if new att is equal to cx, cy etc
	                if(strcmp("cx",(newAttribute->name)) == 0)
	               	{
	               		float temp = atof(newAttribute->value);
	               		circle->cx = temp;
		            	return;
	               	}
	                if(strcmp("cy",(newAttribute->name)) == 0)
	               	{
						float temp = atof(newAttribute->value);
	               		circle->cy = temp;
		                return;
					}
		            if(strcmp("r",(newAttribute->name)) == 0)
	               	{
	               		float temp = atof(newAttribute->value);
	               		circle->r = temp;

		                return;
					}

	                ListIterator iter2 = createIterator(circle->otherAttributes);
	                ListIterator *var2 = &iter2;
	                Attribute *circleInside = nextElement(var2);






                    if(strcmp(newAttribute->name, "fill") == 0)
                    {

                        while(circleInside != NULL)
                        {


                            if(strcmp(circleInside->name, "fill") == 0)
                            {

                                strcpy(circleInside->name, "fill");//replace it 
                                strcpy(circleInside->value, newAttribute->value);//replace it 
                                return;

                            }
                            circleInside = nextElement(var2);
                        }
                            
                        Attribute *attAdd = createAttribute();
                        strcpy(attAdd->name, newAttribute->name);
                        strcpy(attAdd->value, newAttribute->value);
                        addComponent(image, CIRC, (void*)attAdd);


                        return;

                    }
                    if(strcmp(newAttribute->name, "stroke") == 0)
                    {

                        while(circleInside != NULL)
                        {


                            if(strcmp(circleInside->name, "stroke") == 0)
                            {
                                strcpy(circleInside->name, "stroke");//replace it 
                                strcpy(circleInside->value, newAttribute->value);//replace it 
                                return;

                            }
                            circleInside = nextElement(var2);
                        }
                            
                        Attribute *attAdd = createAttribute();
                        strcpy(attAdd->name, newAttribute->name);
                        strcpy(attAdd->value, newAttribute->value);
                        addComponent(image, CIRC, (void*)attAdd);


                        return;

                    }
                    if(strcmp(newAttribute->name, "stroke-width") == 0)
                    {

                        while(circleInside != NULL)
                        {


                            if(strcmp(circleInside->name, "stroke-width") == 0)
                            {
                                strcpy(circleInside->name, "stroke-width");//replace it 
                                strcpy(circleInside->value, newAttribute->value);//replace it 
                                return;

                            }
                            circleInside = nextElement(var2);
                        }
                            
                        Attribute *attAdd = createAttribute();
                        strcpy(attAdd->name, newAttribute->name);
                        strcpy(attAdd->value, newAttribute->value);
                        addComponent(image, CIRC, (void*)attAdd);


                        return;

                    }

	            }
	            counter++;
                circle = nextElement(var1);

            }
            break;

        case RECT: ;
                   

        if(elemIndex < 0)
        {
        	return;
        }        




        ListIterator iter3 = createIterator(image->rectangles);

        ListIterator *var3 = &iter3;
        Rectangle *rect = nextElement(var3);
        int counter = 0;



		int value = 0;
        while(rect!=NULL)
        {
            if(counter == elemIndex)
			{
				value++;



				if(strcmp("x",(newAttribute->name)) == 0)
	            {
	            	float temp = atof(newAttribute->value);
	               	rect->x = temp;
		            return;
				}
				if(strcmp("y",(newAttribute->name)) == 0)
	            {
					float temp = atof(newAttribute->value);
	               	rect->y = temp;
		            return;
				}
		        if(strcmp("width",(newAttribute->name)) == 0)
	            {
	            	float temp = atof(newAttribute->value);
	               	rect->width = temp;

		            return;
				}
		        if(strcmp("height",(newAttribute->name)) == 0)
	            {
	            	float temp = atof(newAttribute->value);
	               	rect->height = temp;

		            return;
				}

				ListIterator iter4 = createIterator(rect->otherAttributes);
	            ListIterator *var4 = &iter4;
	            Attribute *rectInside = nextElement(var4);




		    	if(strcmp(newAttribute->name, "fill") == 0)
               	{

					while(rectInside != NULL)
					{


			    		if(strcmp(rectInside->name, "fill") == 0)
			    		{

			            	strcpy(rectInside->name, "fill");//replace it 
			            	strcpy(rectInside->value, newAttribute->value);//replace it 
			            	return;

			    		}
            			rectInside = nextElement(var4);
					}
						
					Attribute *attAdd = createAttribute();
    				strcpy(attAdd->name, newAttribute->name);
            		strcpy(attAdd->value, newAttribute->value);
					addComponent(image, RECT, (void*)attAdd);


					return;

				}
		    	if(strcmp(newAttribute->name, "stroke") == 0)
               	{

					while(rectInside != NULL)
					{


			    		if(strcmp(rectInside->name, "stroke") == 0)
			    		{
			            	strcpy(rectInside->name, "stroke");//replace it 
			            	strcpy(rectInside->value, newAttribute->value);//replace it 
			            	return;

			    		}
            			rectInside = nextElement(var4);
					}
						
					Attribute *attAdd = createAttribute();
    				strcpy(attAdd->name, newAttribute->name);
            		strcpy(attAdd->value, newAttribute->value);
					addComponent(image, RECT, (void*)attAdd);


					return;

				}
		    	if(strcmp(newAttribute->name, "stroke-width") == 0)
               	{

					while(rectInside != NULL)
					{


			    		if(strcmp(rectInside->name, "stroke-width") == 0)
			    		{
			            	strcpy(rectInside->name, "stroke-width");//replace it 
			            	strcpy(rectInside->value, newAttribute->value);//replace it 
			            	return;

			    		}
            			rectInside = nextElement(var4);
					}
						
					Attribute *attAdd = createAttribute();
    				strcpy(attAdd->name, newAttribute->name);
            		strcpy(attAdd->value, newAttribute->value);
					addComponent(image, RECT, (void*)attAdd);


					return;

				}


 
        	}
            rect = nextElement(var3);
	        counter++;

        } 
            break;
        case PATH: ;
        
        if(elemIndex < 0)
        {
        	return;
        } 

        ListIterator iter5 = createIterator(image->paths);

        ListIterator *var5 = &iter5;
        Path *path = nextElement(var5);
        counter = 0;

        while(path !=NULL)
        {
            // printf("in loop\n");
            if(elemIndex == counter)
            {
            	if(strcmp("d",(newAttribute->name)) == 0)
               	{

	            	strcpy(path->data, newAttribute->value);//replace it
	                return;
               	}


                ListIterator iter6 = createIterator(path->otherAttributes);
                ListIterator *var6 = &iter6;
                Attribute *pathInside = nextElement(var6);


                if(strcmp(newAttribute->name, "fill") == 0)
                {

                    while(pathInside != NULL)
                    {


                        if(strcmp(pathInside->name, "fill") == 0)
                        {
                            strcpy(pathInside->name, "fill");//replace it 
                            strcpy(pathInside->value, newAttribute->value);//replace it 
                            return;

                        }
                        pathInside = nextElement(var6);
                    }
                        
                    Attribute *attAdd = createAttribute();
                    strcpy(attAdd->name, newAttribute->name);
                    strcpy(attAdd->value, newAttribute->value);
                    addComponent(image, PATH, (void*)attAdd);


                    return;

                }
                if(strcmp(newAttribute->name, "transform") == 0)
                {

                    while(pathInside != NULL)
                    {


                        if(strcmp(pathInside->name, "transform") == 0)
                        {
                            strcpy(pathInside->name, "transform");//replace it 
                            strcpy(pathInside->value, newAttribute->value);//replace it 
                            return;

                        }
                        pathInside = nextElement(var6);
                    }
                        
                    Attribute *attAdd = createAttribute();
                    strcpy(attAdd->name, newAttribute->name);
                    strcpy(attAdd->value, newAttribute->value);
                    addComponent(image, PATH, (void*)attAdd);


                    return;

                }

        	}
                counter++;    
            	path = nextElement(var5);


        } 
        break;
        case GROUP: ;//add group

        if(elemIndex < 0)
        {
        	return;
        } 

            ListIterator iter7 = createIterator(image->groups);

            ListIterator *var7 = &iter7;
            Group *group = nextElement(var7);
            counter = 0;

            while(group !=NULL)
            {

            	if(elemIndex == counter)
            	{


	                ListIterator iter8 = createIterator(group->otherAttributes);
	                ListIterator *var8 = &iter8;
	                Attribute *groupInside = nextElement(var8);

                    if(strcmp(newAttribute->name, "fill") == 0)
                    {

                        while(groupInside != NULL)
                        {


                            if(strcmp(groupInside->name, "fill") == 0)
                            {
                                strcpy(groupInside->name, "fill");//replace it 
                                strcpy(groupInside->value, newAttribute->value);//replace it 
                                return;

                            }
                            groupInside = nextElement(var8);
                        }
                            
                        Attribute *attAdd = createAttribute();
                        strcpy(attAdd->name, newAttribute->name);
                        strcpy(attAdd->value, newAttribute->value);
                        addComponent(image, GROUP, (void*)attAdd);


                        return;

                    }
                    if(strcmp(newAttribute->name, "transform") == 0)
                    {

                        while(groupInside != NULL)
                        {


                            if(strcmp(groupInside->name, "transform") == 0)
                            {
                                strcpy(groupInside->name, "transform");//replace it 
                                strcpy(groupInside->value, newAttribute->value);//replace it 
                                return;

                            }
                            groupInside = nextElement(var8);
                        }
                            
                        Attribute *attAdd = createAttribute();
                        strcpy(attAdd->name, newAttribute->name);
                        strcpy(attAdd->value, newAttribute->value);
                        addComponent(image, GROUP, (void*)attAdd);


                        return;

                    }

            	}
            	counter++;
                group = nextElement(var7);


            } 
            break;

        default:
            return;
    }

}


char *SVGtoJSON(const SVGimage* imge, char *file)
{
    char * title = malloc(sizeof(char) * 256);
    char * desc = malloc(sizeof(char) * 256);

    strcpy(title, imge->title);
    strcpy(desc, imge->description);

    if(imge == NULL)
    {
        return "[]";
    }

    int numRect = 0, numCirc = 0, numPath = 0, numGroup = 0;



    ListIterator iter = createIterator(imge->rectangles);

    ListIterator *var = &iter;
    Rectangle *rect = nextElement(var);

    while(rect != NULL)
    {
        numRect++;
        rect = nextElement(var);

    }

    ListIterator iter1 = createIterator(imge->circles);

    ListIterator *var1 = &iter1;
    Circle *circ = nextElement(var1);

    while(circ != NULL)
    {
        numCirc++;
        circ = nextElement(var1);

    }

    ListIterator iter2 = createIterator(imge->paths);

    ListIterator *var2 = &iter2;
    Path *path = nextElement(var2);

    while(path != NULL)
    {
        numPath++;
        path = nextElement(var2);

    }

    ListIterator iter3 = createIterator(imge->groups);

    ListIterator *var3 = &iter3;
    Group *group = nextElement(var3);

    while(group != NULL)
    {
        numGroup++;
        numRect = groupRecursiveRect(numRect, group);
        numPath = groupRecursivePath(numPath, group);
        numCirc = groupRecursiveCirc(numCirc, group);
        numGroup = groupRecursiveGroup(numGroup, group);
        group = nextElement(var3);
    }


    char * string = "";
    string = malloc(sizeof(char)*(500));



  
  
    FILE* fp = fopen(file, "r"); 
    fseek(fp, 0L, SEEK_END); 
    float fileSize = ftell(fp); 
    fileSize = fileSize/1000;
    fclose(fp); 
  

    sprintf(string, "{\"file\":\"%s\",\"fileSize\":%.2f,\"title\":\"%s\",\"desc\":\"%s\",\"numRect\":%d,\"numCirc\":%d,\"numPaths\":%d,\"numGroups\":%d}", file, fileSize, title, desc, numRect,numCirc,numPath, numGroup);

    return string;
}

char *attrToJSON(const Attribute *a)
{
	if(a == NULL)
	{
		return "{}";
	}
	char * string = "";
	string = malloc(sizeof(char)*(50 + strlen(a->name)+ strlen(a->value)));//23 characters in json format

	sprintf(string, "{\"name\":\"%s\",\"value\":\"%s\"}", a->name, a->value);

	return string;

}
char *circleToJSON(const Circle *c)
{
	if(c == NULL)
	{
		return "{}";		
	}
	char * string = "";
	string = malloc(sizeof(char)*(23 + (c->cx+ c->cy+ c->cy + 2)));//23 characters in json format

    int length = 0;

    ListIterator iter = createIterator(c->otherAttributes);

    ListIterator *var = &iter;
    Circle *circ = nextElement(var);

    while(circ != NULL)
    {
        length++;
        circ = nextElement(var);
    }

    sprintf(string, "{\"cx\":%0.2f,\"cy\":%0.2f,\"r\":%0.2f,\"numAttr\":%d,\"units\":\"%s\"}", c->cx, c->cy, c->r, length, c->units);

	return string;
}
char *rectToJSON(const Rectangle *r)
{
	if(r == NULL)
	{
		return "{}";
	}
	char * string = "";
	string = malloc(sizeof(char)*(23 + (r->x + r->y + r->width + r->height + 2)));//23 characters in json format
	int length = 0;

    ListIterator iter = createIterator(r->otherAttributes);

    ListIterator *var = &iter;
    Rectangle *rect = nextElement(var);

    while(rect != NULL)
    {
    	length++;
    	rect = nextElement(var);
    }

    sprintf(string, "{\"x\":%0.2f,\"y\":%0.2f,\"w\":%0.2f,\"h\":%0.2f,\"numAttr\":%d,\"units\":\"%s\"}", r->x, r->y, r->width, r->height, length, r->units);


	return string;
}
char *pathToJSON(const Path *p)
{
	if(p == NULL)
	{
		return "{}";
	}
	char * string = "";
	string = malloc(sizeof(char)*(23 + strlen(p->data) + 10));//23 characters in json format
	int length = 0;

    ListIterator iter = createIterator(p->otherAttributes);

    ListIterator *var = &iter;
    Path *path = nextElement(var);

    while(path != NULL)
    {
    	length++;
    	path = nextElement(var);
    }


	sprintf(string, "{\"d\":\"%s\",\"numAttr\":%d}", p->data, length);

	return string;
}
char *groupToJSON(const Group *g)
{
	if(g == NULL)
	{
		return "{}";
	}
	char *string = "";
	string = malloc(sizeof(char)*(23 + 1000));//23 characters in json format
	int length = 0;
	int attLength = 0;

    ListIterator iter = createIterator(g->rectangles);//rect

    ListIterator *var = &iter;
    Rectangle *rect = nextElement(var);

    while(rect != NULL)
    {
    	length++;
    	rect = nextElement(var);
    }
    ListIterator iter1 = createIterator(g->paths);//path

    ListIterator *var1 = &iter1;
    Path *path = nextElement(var1);

    while(path != NULL)
    {
    	length++;
    	path = nextElement(var1);
    }
    ListIterator iter2 = createIterator(g->circles);//circle

    ListIterator *var2 = &iter2;
    Circle *circle = nextElement(var2);

    while(circle != NULL)
    {
    	length++;
    	circle = nextElement(var2);
    }
    ListIterator iter3 = createIterator(g->groups);//group

    ListIterator *var3 = &iter3;
    Group *group3 = nextElement(var3);

    while(group3 != NULL)
    {
    	length++;
    	group3 = nextElement(var3);
    }
    ListIterator iter4 = createIterator(g->otherAttributes);//other att

    ListIterator *var4 = &iter4;
    Attribute *otherAtt = nextElement(var4);

    while(otherAtt != NULL)
    {
    	attLength++;
    	otherAtt = nextElement(var4);
    }



	sprintf(string, "{\"children\":%d,\"numAttr\":%d}", length, attLength);

	return string;
}
char *attrListToJSON(List *list)
{
    if(list == NULL || getLength(list) == 0)
    {
        return "[]";
    }
	int length = 0;

    char returnVal[1000000] = "";

    ListIterator iter;
    iter.current = list->head;


    ListIterator *var = &iter;
    Attribute *att = nextElement(var);


    char * string = "";
	// string = malloc(sizeof(char)*(strlen(att->name)+strlen(att->value)+23));
    string = malloc((sizeof(char)*100)+23);


	char * temp = "";
    // temp = malloc(sizeof(char)*(100*strlen(att->name))+((100*strlen(att->value))+23));
    temp = malloc((sizeof(char)*100000)+23);


    while(att != NULL)
    {

		if(length ==0)
		{
			sprintf(string, "[{\"name\":\"%s\",\"value\":\"%s\"}", att->name, att->value);
		}
		else
		{
			sprintf(string, "{\"name\":\"%s\",\"value\":\"%s\"}", att->name, att->value);
		}
    	length++;

    	att = nextElement(var);
    	if(att!= NULL)
    	{
			strcat(string, ",");
		}
		else
		{
			strcat(string, "]");
		}
		strcat(temp,string);
        strcat(returnVal, string);
    // printf("strcat in C: %s\n\n\n", string);


    }

    free(string);
    strcpy(temp, returnVal);

    // printf("the attribute val in C: %s\n\n\n", temp);

	return temp;
}
char *circListToJSON(List *list)
{
    if(list == NULL || getLength(list) == 0)
    {
        return "[]";
    }

    int counter = 0;
    int length = 0;


    ListIterator iter;
    iter.current = list->head;


    ListIterator *var = &iter;
    Circle *circ = nextElement(var);


    char * string = "";
    string = malloc(sizeof(char)*(1000));

    char returnVal[1000000] = "";

    char * temp = "";

    while(circ != NULL)
    {


        ListIterator iter = createIterator(circ->otherAttributes);


        ListIterator *var1 = &iter;
        Circle *circ1 = nextElement(var1);

        while(circ1 != NULL)
        {
            length++;
            circ1 = nextElement(var1);
        }



        if(counter ==0)
        {
            sprintf(string, "[{\"cx\":%.2f,\"cy\":%.2f,\"r\":%.2f,\"numAttr\":%d,\"units\":\"%s\"}", circ->cx, circ->cy, circ->r, length, circ->units);

        }
        else
        {
            sprintf(string, "{\"cx\":%.2f,\"cy\":%.2f,\"r\":%.2f,\"numAttr\":%d,\"units\":\"%s\"}", circ->cx, circ->cy, circ->r, length, circ->units);

        }
        counter++;

        temp = malloc(sizeof(char)*(1000000*strlen(string)));

        circ = nextElement(var);
        if(circ!= NULL)
        {
            strcat(string, ",");
        }
        else
        {
            strcat(string, "]");
        }
        strcat(temp,string);
        strcat(returnVal,string);
    }

    free(string);

    strcpy(temp, returnVal);

        // if(strcmp(temp,"") == 0)
        // {
        //     strcpy(temp, "[]");
        // }
    // printf("LINE BY LINE FOR CIRCLEEEEEEE  : |%s|\n\n", temp);

    return temp;

}
char *rectListToJSON(List *list)
{
	if(list == NULL || (getLength(list)) == 0)
	{
		return "[]";
	}

	int counter = 0;
	int length = 0;


    ListIterator iter;
    iter.current = list->head;


    ListIterator *var = &iter;
    Rectangle *rect = nextElement(var);

    // printf("|%f|", rect->x);

    char * string = "";
	string = malloc(sizeof(char)*(1000));

    char returnVal[1000000] = "";
	char * temp = "";

    while(rect != NULL)
    {


	    ListIterator iter = createIterator(rect->otherAttributes);


	    ListIterator *var1 = &iter;
	    Rectangle *rect1 = nextElement(var1);

	    while(rect1 != NULL)
	    {
	    	length++;

            // printf("\t\t\tTHE GET lENGTH : %d\n\n\n", getLength(rect1->rectangles));
	    	rect1 = nextElement(var1);
	    }
            // printf("\t\t\tTHE GET lENGTH : %d\n\n\n", length);



		if(counter ==0)
		{
			sprintf(string, "[{\"x\":%.2f,\"y\":%.2f,\"w\":%.2f,\"h\":%.2f,\"numAttr\":%d,\"units\":\"%s\"}", rect->x, rect->y, rect->width, rect->height, length, rect->units);

		}
		else
		{
            sprintf(string, "{\"x\":%.2f,\"y\":%.2f,\"w\":%.2f,\"h\":%.2f,\"numAttr\":%d,\"units\":\"%s\"}", rect->x, rect->y, rect->width, rect->height, length, rect->units);

		}
    	counter++;

		temp = malloc(sizeof(char)*(1000000*strlen(string)));

    	rect = nextElement(var);
    	if(rect!= NULL)
    	{
			strcat(string, ",");
		}
		else
		{
			strcat(string, "]");
		}

        strcat(temp,string);
        strcat(returnVal,string);

        // strncat(temp,string, strlen(string));
            // sprintf(temp, "[{\"x\":%.2f,\"y\":%.2f,\"w\":%.2f,\"h\":%.2f,\"numAttr\":%d,\"units\":\"%s\"}]", rect->x, rect->y, rect->width, rect->height, length, rect->units);

    // printf("LINE BY LINE FOR RECTANGLEEE  c: |%s|\n\n", string);

    // printf("RECT in c: %s\n\n", temp);
    // printf("RECT in c: %s\n\n", returnVal);


    }

    strcpy(temp, returnVal);
    // strcpy(returnVal, "");
    // printf("RECT in c: %s\n\n", temp);

    free(string);

	return temp;

}
char *pathListToJSON(List *list)
{
    if(list == NULL || getLength(list) == 0)
    {
        return "[]";
    }

    int counter = 0;
    int length = 0;


    ListIterator iter;
    iter.current = list->head;


    ListIterator *var = &iter;
    Path *path = nextElement(var);


    char * string = "";
    string = malloc(sizeof(char)*(1000));

    char returnVal[1000000] = "";

    // char * newVal = "";
    // newVal= malloc(sizeof(char)*(1000));

    char * temp = "";

    while(path != NULL)
    {


        ListIterator iter = createIterator(path->otherAttributes);


        ListIterator *var1 = &iter;
        Path *path1 = nextElement(var1);

        while(path1 != NULL)
        {
            length++;
            path1 = nextElement(var1);
        }

        if(counter ==0)
        {
            sprintf(string, "[{\"d\":\"%s\",\"numAttr\":%d}",path->data, length);
            // strcat(newVal, string);

        }
        else
        {
            sprintf(string, "{\"d\":\"%s\",\"numAttr\":%d}",path->data, length);
            // sprintf(string, "[{\"d\":\"%s\",\"numAttr\":%d}",path->data, length);
            // strcat(newVal, string);
        }
        counter++;

        temp = malloc(sizeof(char)*(1000000*strlen(string)));

        path = nextElement(var);
        if(path!= NULL)
        {
            strcat(string, ",");
        }
        else
        {
            strcat(string, "]");
        }
        strcat(temp,string);
        strcat(returnVal, string);
    }

    free(string);
    strcpy(temp, returnVal);

        // printf("\t\tfull PATHHHHHHHHHHH\t\t\t: %s\n\n\n\n", temp);


    return temp;
}
char *groupListToJSON(List *list)
{
    if(list == NULL || getLength(list) == 0)
    {
        return "[]";
    }

	int counter = 0;
	int length = 0;


    ListIterator iter;
    iter.current = list->head;


    ListIterator *var = &iter;
    Group *group = nextElement(var);


    char * string = "";
	string = malloc(sizeof(char)*(50));


	char * temp = "";
	temp = malloc(sizeof(char)*(100000)+ 50);

    char returnVal[1000000] = "";


	int children = 0;


    while(group != NULL)
    {
    	ListIterator iter1 = createIterator(group->circles);


	    ListIterator *var2 = &iter1;
	    Group *group2 = nextElement(var2);

	    while(group2 != NULL)
	    {
	    	children++;
	    	group2 = nextElement(var2);
	    }
    	ListIterator iter2 = createIterator(group->rectangles);


	    ListIterator *var3 = &iter2;
	    Group *group3 = nextElement(var3);

	    while(group3 != NULL)
	    {
	    	children++;
	    	group3 = nextElement(var3);
	    }
    	ListIterator iter3 = createIterator(group->paths);


	    ListIterator *var4 = &iter3;
	    Group *group4 = nextElement(var4);

	    while(group4 != NULL)
	    {
	    	children++;
	    	group4 = nextElement(var4);
	    }

	    ListIterator iter = createIterator(group->otherAttributes);


	    ListIterator *var1 = &iter;
	    Group *group1 = nextElement(var1);

	    while(group1 != NULL)
	    {
	    	length++;
	    	group1 = nextElement(var1);
	    }


		if(counter ==0)
		{
			sprintf(string, "[{\"children\":%d,\"numAttr\":%d}", children, length);
		}
		else
		{
			sprintf(string, "{\"children\":%d,\"numAttr\":%d}",children, length);
		}
		length = 0;
    	counter++;

    	group = nextElement(var);
    	if(group!= NULL)
    	{
			strcat(string, ",");
		}
		else
		{
			strcat(string, "]");
		}
		if(counter == 1)
		{
			sprintf(temp, "%s",string);
		}
		else
		{
			strcat(temp,string);
            strcat(returnVal, string);
		}

		children = 0;

    }

    free(string);
    // strcpy(temp, returnVal);
        // printf("\t\tfull GROUPPPPPPP\t\t\t: %s\n\n\n\n", temp);

	return temp;

}
int groupRecursiveRect(int numRect, Group *g)
{
	ListIterator iter = createIterator(g->rectangles);

    ListIterator *var = &iter;
    Rectangle *rect = nextElement(var);


    while(rect != NULL)
    {
    	numRect++;
    	rect = nextElement(var);

    }

    return numRect;
}
int groupRecursivePath(int numPath, Group *g)
{
	ListIterator iter = createIterator(g->paths);

    ListIterator *var = &iter;
    Path *path = nextElement(var);


    while(path != NULL)
    {
    	numPath++;
    	path = nextElement(var);

    }

    return numPath;
}
int groupRecursiveCirc(int numCirc, Group *g)
{
	ListIterator iter = createIterator(g->circles);

    ListIterator *var = &iter;
    Circle *circ = nextElement(var);


    while(circ != NULL)
    {
    	numCirc++;
    	circ = nextElement(var);

    }

    return numCirc;
}
int groupRecursiveGroup(int numGroup, Group *g)
{
	ListIterator iter = createIterator(g->groups);

    ListIterator *var = &iter;
    Group *group = nextElement(var);


    while(group != NULL)
    {
    	numGroup++;
		groupRecursiveGroup(numGroup, group);
    	group = nextElement(var);

    }

    return numGroup;
}

SVGimage* createValidSVGimage(char* fileName, char* schemaFile)//second(has filename)
{

	if(fileName == NULL || schemaFile == NULL)
	{
		return NULL;
	}
    SVGimage *svg = NULL;
	xmlDocPtr doc;
    xmlSchemaPtr schema = NULL;
	xmlSchemaParserCtxtPtr ctxt;

	int ret = 0;
 
	xmlLineNumbersDefault(1);
 
	ctxt = xmlSchemaNewParserCtxt(schemaFile);
 
	xmlSchemaSetParserErrors(ctxt, (xmlSchemaValidityErrorFunc) fprintf, (xmlSchemaValidityWarningFunc) fprintf, stderr);
	schema = xmlSchemaParse(ctxt);
	xmlSchemaFreeParserCtxt(ctxt);
 
 
	doc = xmlReadFile(fileName, NULL, 0);
 
	if (doc == NULL){
		fprintf(stderr, "Could not parse %s\n", fileName);
        svg = NULL;

	}
	else{
		xmlSchemaValidCtxtPtr ctxt;
 
		ctxt = xmlSchemaNewValidCtxt(schema);
		xmlSchemaSetValidErrors(ctxt, (xmlSchemaValidityErrorFunc) fprintf, (xmlSchemaValidityWarningFunc) fprintf, stderr);
		ret = xmlSchemaValidateDoc(ctxt, doc);
 
		if (ret == 0){
			// printf("%s validates\n", fileName);

            // if(ctxt == NULL )
            // {
            //     return NULL;
            // }

			svg = createSVGimage(fileName);
		}
		else if (ret > 0){
            svg = NULL;
		}
		else{
            svg = NULL;
		}
		xmlSchemaFreeValidCtxt(ctxt);
		xmlFreeDoc(doc);
	}
 

	if(schema != NULL)
		xmlSchemaFree(schema);
 
	xmlSchemaCleanupTypes();
	xmlCleanupParser();
	xmlMemoryDump();



	if (svg == NULL)
	{
		return NULL;
	}
 	
 	return svg;
}

bool writeSVGimage(SVGimage* image, char* fileName)//first
{

    if (image == NULL || fileName == NULL)
    {
        return false;
    }



    xmlDocPtr doc = NULL;
    doc = convertSVGToDoc(image);

    printf("filename: %s", fileName);
    xmlSaveFormatFileEnc(fileName, doc, NULL, 1);



    xmlFreeDoc(doc);

    xmlCleanupParser();

    xmlMemoryDump();

    return true;
}
bool validateSVGimage(SVGimage* image, char* schemaFile)//validate structs 
{
    if (image == NULL || schemaFile == NULL)
    {
        return false;
    }

    xmlSchemaPtr schema = NULL;
	xmlSchemaParserCtxtPtr ctxt;
	int ret = 0;
	bool check = true;

    xmlDocPtr doc = convertSVGToDoc(image);


    xmlLineNumbersDefault(1);
 
	ctxt = xmlSchemaNewParserCtxt(schemaFile);
 
	xmlSchemaSetParserErrors(ctxt, (xmlSchemaValidityErrorFunc) fprintf, (xmlSchemaValidityWarningFunc) fprintf, stderr);
	schema = xmlSchemaParse(ctxt);
	xmlSchemaFreeParserCtxt(ctxt);
  
	if (doc == NULL){
		// fprintf(stderr, "Could not convert Image to Doc\n");
		return false;

	}
	else{
		xmlSchemaValidCtxtPtr ctxt;
 
		ctxt = xmlSchemaNewValidCtxt(schema);
		xmlSchemaSetValidErrors(ctxt, (xmlSchemaValidityErrorFunc) fprintf, (xmlSchemaValidityWarningFunc) fprintf, stderr);
		ret = xmlSchemaValidateDoc(ctxt, doc);
 
		if (ret != 0)
		{
			return false;
		}
				

		xmlSchemaFreeValidCtxt(ctxt);
		xmlFreeDoc(doc);
	}
 

	if(schema != NULL)
	xmlSchemaFree(schema);
 
	xmlSchemaCleanupTypes();
	xmlCleanupParser();
	xmlMemoryDump();


    check = constraintsChecker(image);

    if (!check)
    {
		return false;
    }

    return true;
}
xmlDocPtr convertSVGToDoc(SVGimage * image)//uncomment if statement when i get desc and title 
{
    xmlDocPtr doc = NULL; 
    xmlNodePtr root_node = NULL;

    LIBXML_TEST_VERSION;

    doc = xmlNewDoc(BAD_CAST NULL);

    root_node = xmlNewNode(NULL, BAD_CAST "svg");
    xmlDocSetRootElement(doc, root_node);


    xmlNsPtr newName = xmlNewNs(root_node,BAD_CAST image->namespace, BAD_CAST NULL);

    xmlSetNs(root_node, newName);
  
    if(strcmp(image->title, "")!= 0)
    {
		    xmlNodePtr node = NULL, node1 = NULL;
		    node = xmlNewChild(root_node, NULL, BAD_CAST "title",
                BAD_CAST "");
		    node1 = xmlNewText(BAD_CAST
		                   image->title);
		    xmlAddChild(node, node1);
		    xmlAddChild(root_node, node);

    }
    if(strcmp(image->description, "")!= 0)
    {
		    xmlNodePtr node = NULL, node1 = NULL;
		    node = xmlNewChild(root_node, NULL, BAD_CAST "desc",
                BAD_CAST "");
		    node1 = xmlNewText(BAD_CAST
		                   image->description);
		    xmlAddChild(node, node1);
		    xmlAddChild(root_node, node);
    }

    ListIterator iter1 = createIterator(image->otherAttributes);

    ListIterator *var1 = &iter1;
    Attribute *otherAtt = nextElement(var1);

    while(otherAtt!= NULL)
    {
        
        xmlNewProp(root_node, BAD_CAST otherAtt->name, BAD_CAST otherAtt->value);
        otherAtt = nextElement(var1);
    }

    bool check = true;

    check = writeRectNodes(image, root_node);
    if(!check)
    {
    	return NULL;
    }
    check = writePathNodes(image, root_node);
    if(!check)
    {
    	return NULL;
    }
    check = writeCircleNodes(image, root_node);
    if(!check)
    {
    	return NULL;
    }
    check = writeGroupNodes(image, root_node);
    if(!check)
    {
    	return NULL;
    }

    return doc;
}
bool constraintsChecker(SVGimage *svg)
{

    if (svg->rectangles == NULL || svg->circles == NULL || svg->paths == NULL || svg->groups == NULL || svg->otherAttributes == NULL)
    {

        return false;
    }
    if (svg->namespace == NULL || svg->title == NULL || svg->description == NULL)
    {
        return false;
    }

    ListIterator iter = createIterator(svg->otherAttributes);//svg other att

    ListIterator *var = &iter;
    Attribute *otherAtt = nextElement(var);

    // if (otherAtt == NULL)
    // {
    //     printf("\t\t\tits false here\n");
    //     // return false;
    // }
    while(otherAtt!= NULL)
    {
        if (otherAtt->name == NULL || otherAtt->value == NULL)
        {
        // printf("svg name and value is null\n");
            return false;
        }

        otherAtt = nextElement(var);
    }

    //CIRCLES HERE

    ListIterator iter1 = createIterator(svg->circles);

    ListIterator *var1 = &iter1;

    bool val2 = groupCircle(var1);
        
    if(!val2)
    {
        return false;
    }

    //RECTANGLES HERE

    ListIterator iter3 = createIterator(svg->rectangles);
    ListIterator *var3 = &iter3;
    
    bool val = groupRect(var3);
    if(!val)
    {
        return false;
    }

    //PATHS HERE
    ListIterator iter5 = createIterator(svg->paths);

    ListIterator *var5 = &iter5;

    bool val1 = groupPath(var5);
    if(!val1)
    {
        return false;
    }


    //groups

    ListIterator iter7 = createIterator(svg->groups);

    ListIterator *var7 = &iter7;
    Group *group = nextElement(var7);

    while(group!= NULL)
    {

        ListIterator iter9 = createIterator(group->rectangles);
        ListIterator *var9 = &iter9;

        //call rect function
        bool val = groupRect(var9);
        
        if(!val)
        {
            return false;
        }

        //circles
        ListIterator iter10 = createIterator(group->circles);
        ListIterator *var10 = &iter10;

        bool val2 = groupCircle(var10);
        
        if(!val2)
        {
            return false;
        }
        //paths
        ListIterator iter11 = createIterator(group->paths);
        ListIterator *var11 = &iter11;

        bool val1 = groupPath(var11);
        if(!val1)
        {
            return false;
        }

        ListIterator iter12 = createIterator(group->groups);
        ListIterator *var12 = &iter12;

        //groups in groups
        bool val3 = groupInGroup(var12);
        if(!val3)
        {
            return false;
        }

        //other att
        ListIterator iter8 = createIterator(group->otherAttributes);

        ListIterator *var8 = &iter8;
        Attribute *otherAtt = nextElement(var8);

        while(otherAtt!=NULL)
        {

            if (otherAtt->name == NULL || otherAtt->value == NULL)
            {
                return false;
            }
            
            otherAtt = nextElement(var8);

        }

        group = nextElement(var7);
    }



    return true;
}
void rectWriteHelp(Group * g, xmlNodePtr root_node)
{

    xmlNodePtr node = NULL;

    if(g == NULL)
    {
        return;
    }

    
    ListIterator iter = createIterator(g->rectangles);

    ListIterator *var = &iter;
    Rectangle *rect = nextElement(var);

    while(rect != NULL)
    {


        char xUnit[256];
        char yUnit[256];
        char width[256];
        char height[256];

        sprintf(xUnit, "%.1f", rect->x);
        sprintf(yUnit, "%.1f", rect->y);
        sprintf(width, "%.1f", rect->width);
        sprintf(height, "%.1f", rect->height);


        strcat(xUnit, rect->units);
        strcat(yUnit, rect->units);
        strcat(width, rect->units);
        strcat(height, rect->units);



        node =
            xmlNewChild(root_node, NULL, BAD_CAST "rect", NULL);//groups add to node not root node
        xmlNewProp(node, BAD_CAST "x", BAD_CAST xUnit);
        xmlNewProp(node, BAD_CAST "y", BAD_CAST yUnit);
        xmlNewProp(node, BAD_CAST "width", BAD_CAST width);
        xmlNewProp(node, BAD_CAST "height", BAD_CAST height);



        ListIterator iter1 = createIterator(rect->otherAttributes);

        ListIterator *var1 = &iter1;
        Attribute *otherAtt = nextElement(var1);

        while(otherAtt!= NULL)
        {


            xmlNewProp(node, BAD_CAST otherAtt->name, BAD_CAST otherAtt->value);
            otherAtt = nextElement(var1);
        }




        rect = nextElement(var);
    }


}
 
void circleWriteHelp(Group * g, xmlNodePtr root_node)
{
    xmlNodePtr node = NULL;

    if(g == NULL)
    {
        return;
    }

    ListIterator iter = createIterator(g->circles);

    ListIterator *var = &iter;
    Circle *circ = nextElement(var);

    while(circ != NULL)
    {

        char xUnit[256];
        char yUnit[256];
        char radius[256];
        
        sprintf(xUnit, "%.1f", circ->cx);
        sprintf(yUnit, "%.1f", circ->cy);
        sprintf(radius, "%.1f", circ->r);
       
        strcat(xUnit, circ->units);
        strcat(yUnit, circ->units);
        strcat(radius, circ->units);
     


        node = xmlNewChild(root_node, NULL, BAD_CAST "circle", NULL);//groups add to node not root node
        xmlNewProp(node, BAD_CAST "cx", BAD_CAST xUnit);
        xmlNewProp(node, BAD_CAST "cy", BAD_CAST yUnit);
        xmlNewProp(node, BAD_CAST "r", BAD_CAST radius);



        ListIterator iter1 = createIterator(circ->otherAttributes);

        ListIterator *var1 = &iter1;
        Attribute *otherAtt = nextElement(var1);

        while(otherAtt!= NULL)
        {


            xmlNewProp(node, BAD_CAST otherAtt->name, BAD_CAST otherAtt->value);
            otherAtt = nextElement(var1);
        }



        circ = nextElement(var);
    }

}

void pathWriteHelp(Group * g, xmlNodePtr root_node)
{

    xmlNodePtr node = NULL;

    if(g == NULL)
    {
        return;
    }

    
    ListIterator iter = createIterator(g->paths);

    ListIterator *var = &iter;
    Path *path = nextElement(var);

    while(path != NULL)
    {

        node = xmlNewChild(root_node, NULL, BAD_CAST "path", NULL);//groups add to node not root node
        xmlNewProp(node, BAD_CAST "d", BAD_CAST path->data);



        ListIterator iter1 = createIterator(path->otherAttributes);

        ListIterator *var1 = &iter1;
        Attribute *otherAtt = nextElement(var1);

        while(otherAtt!= NULL)
        {


            xmlNewProp(node, BAD_CAST otherAtt->name, BAD_CAST otherAtt->value);
            otherAtt = nextElement(var1);
        }


        path = nextElement(var);

    }


}
void groupWriteHelp(Group * g, xmlNodePtr root_node)
{

    xmlNodePtr node = NULL;

    if(g == NULL)

    {
        return;
    }

    ListIterator iter = createIterator(g->groups);

    ListIterator *var = &iter;
    Group *group = nextElement(var);


    while(group != NULL)
    {

      char buff[256];

        sprintf(buff, "g");
        node = xmlNewChild(root_node, NULL, BAD_CAST buff, NULL);


        //rect
        rectWriteHelp(group, node);
        circleWriteHelp(group, node);
        pathWriteHelp(group, node);
        groupWriteHelp(group,node);



        group = nextElement(var);
    }



}

bool writeGroupNodes(SVGimage* img, xmlNodePtr root_node)//add more checks(good)
{
    
    xmlNodePtr node = NULL;


    if(img == NULL)
    {
        return false ;
    }


     ListIterator iter = createIterator(img->groups);

     ListIterator *var = &iter;
     Group *group = nextElement(var);

    while(group != NULL)
    {

        char buff[256];

        sprintf(buff, "g");
        node = xmlNewChild(root_node, NULL, BAD_CAST buff, NULL);

        if(group->paths == NULL|| group->rectangles == NULL|| group->circles == NULL|| group->groups == NULL|| group->otherAttributes == NULL)
        {
            return false;
        }

        //rect
        rectWriteHelp(group, node);
        circleWriteHelp(group, node);
        pathWriteHelp(group, node);
        groupWriteHelp(group, node);



        ListIterator iter1 = createIterator(group->otherAttributes);

        ListIterator *var1 = &iter1;
        Attribute *otherAtt = nextElement(var1);

        while(otherAtt!= NULL)
        {
            if (otherAtt->name == NULL || otherAtt->value == NULL)
            {
                return false;
            }

            xmlNewProp(node, BAD_CAST otherAtt->name, BAD_CAST otherAtt->value);
            otherAtt = nextElement(var1);
        }








        group = nextElement(var);
    }



    // ListIterator iter1 = createIterator(group->otherAttributes);

    // ListIterator *var1 = &iter1;
    // Attribute *att = nextElement(var1);

    // while(att != NULL)
    // {


    //     // node = xmlNewChild(root_node, NULL, BAD_CAST att->name, NULL);
    //         xmlNewProp(node, BAD_CAST att->name, BAD_CAST att->value);
    //         printf("\t\t\tin att loop: %s, %s",att->name, att->value);

    //     att = nextElement(var1);
    // }



	return true;
       

}

bool writePathNodes(SVGimage* img, xmlNodePtr root_node)//add more checks(good)
{
    xmlNodePtr node = NULL;

    if(img == NULL)
    {
        return false;
    }


     ListIterator iter = createIterator(img->paths);

     ListIterator *var = &iter;
     Path *path = nextElement(var);

      while(path != NULL)
      {

        if(path->data == NULL || path->otherAttributes == NULL)
        {
            return false;
        }
  
        node =
            xmlNewChild(root_node, NULL, BAD_CAST "path", NULL);//groups add to node not root node
        xmlNewProp(node, BAD_CAST "d", BAD_CAST path->data);



        ListIterator iter1 = createIterator(path->otherAttributes);

        ListIterator *var1 = &iter1;
        Attribute *otherAtt = nextElement(var1);

        while(otherAtt!= NULL)
        {
            if (otherAtt->name == NULL || otherAtt->value == NULL)
            {
                return false;
            }

            xmlNewProp(node, BAD_CAST otherAtt->name, BAD_CAST otherAtt->value);
            otherAtt = nextElement(var1);
        }


        path = nextElement(var);
      }

      return true;

}

bool writeRectNodes(SVGimage* img, xmlNodePtr root_node)//add more checks(good)
{
    xmlNodePtr node = NULL;

    if(img == NULL)
    {
        return false;
    }


     ListIterator iter = createIterator(img->rectangles);

     ListIterator *var = &iter;
     Rectangle *rect = nextElement(var);

      while(rect != NULL)
      {

        char xUnit[256];
        char yUnit[256];
        char width[256];
        char height[256];

        sprintf(xUnit, "%.1f", rect->x);
        sprintf(yUnit, "%.1f", rect->y);
        sprintf(width, "%.1f", rect->width);
        sprintf(height, "%.1f", rect->height);


        strcat(xUnit, rect->units);
        strcat(yUnit, rect->units);
        strcat(width, rect->units);
        strcat(height, rect->units);



        node =
            xmlNewChild(root_node, NULL, BAD_CAST "rect", NULL);//groups add to node not root node
        xmlNewProp(node, BAD_CAST "x", BAD_CAST xUnit);
        xmlNewProp(node, BAD_CAST "y", BAD_CAST yUnit);
        xmlNewProp(node, BAD_CAST "width", BAD_CAST width);
        xmlNewProp(node, BAD_CAST "height", BAD_CAST height);


        if(rect->x < 0 || rect->y < 0|| rect->width < 0 || rect->height < 0)
        {
            return false;
        }
        if(rect->units == NULL || rect->otherAttributes == NULL)
        {
            return false;
        }

        ListIterator iter1 = createIterator(rect->otherAttributes);

        ListIterator *var1 = &iter1;
        Attribute *otherAtt = nextElement(var1);

          while(otherAtt!= NULL)
          {

            if (otherAtt->name == NULL || otherAtt->value == NULL)
            {
                return false;
            }

            xmlNewProp(node, BAD_CAST otherAtt->name, BAD_CAST otherAtt->value);
            otherAtt = nextElement(var1);
          }




            rect = nextElement(var);
      }

      return true;

}

bool writeCircleNodes(SVGimage* img, xmlNodePtr root_node)//add more checks(good)
{
    xmlNodePtr node = NULL;

    if(img == NULL)
    {
        return false;
    }


     ListIterator iter = createIterator(img->circles);

     ListIterator *var = &iter;
     Circle *circ = nextElement(var);

      while(circ != NULL)
      {

        char xUnit[256];
        char yUnit[256];
        char radius[256];
        
        sprintf(xUnit, "%.1f", circ->cx);
        sprintf(yUnit, "%.1f", circ->cy);
        sprintf(radius, "%.1f", circ->r);
       
        strcat(xUnit, circ->units);
        strcat(yUnit, circ->units);
        strcat(radius, circ->units);
     

        node =
            xmlNewChild(root_node, NULL, BAD_CAST "circle", NULL);//groups add to node not root node
        xmlNewProp(node, BAD_CAST "cx", BAD_CAST xUnit);
        xmlNewProp(node, BAD_CAST "cy", BAD_CAST yUnit);
        xmlNewProp(node, BAD_CAST "r", BAD_CAST radius);


        if(circ->cx < 0 || circ->cy < 0|| circ->r < 0)
        {
            return false;
        }
        if(circ->units == NULL || circ->otherAttributes == NULL)
        {
        	return false;
        }

        ListIterator iter1 = createIterator(circ->otherAttributes);

        ListIterator *var1 = &iter1;
        Attribute *otherAtt = nextElement(var1);

        while(otherAtt!= NULL)
        {

            if (otherAtt->name == NULL || otherAtt->value == NULL)
            {
                return false;
            }
            xmlNewProp(node, BAD_CAST otherAtt->name, BAD_CAST otherAtt->value);
            otherAtt = nextElement(var1);
        }




            circ = nextElement(var);
    }
    return true;


}

bool groupInGroup(ListIterator *var7)//add more checks here(good)
{
    Group *group = nextElement(var7);

    while(group!= NULL)
    {

        if(group->paths == NULL|| group->rectangles == NULL|| group->circles == NULL|| group->groups == NULL|| group->otherAttributes == NULL)
        {
            return false;
        }

        ListIterator iter9 = createIterator(group->rectangles);
        ListIterator *var9 = &iter9;

        //call rect function
        bool val = groupRect(var9);
        
        if(!val)
        {
            return false;
        }

        //circles
        ListIterator iter10 = createIterator(group->circles);
        ListIterator *var10 = &iter10;

        bool val2 = groupCircle(var10);
        
        if(!val2)
        {
            return false;
        }
        //paths
        ListIterator iter11 = createIterator(group->paths);
        ListIterator *var11 = &iter11;

        bool val1 = groupPath(var11);
        if(!val1)
        {
            return false;
        }

        ListIterator iter12 = createIterator(group->groups);
        ListIterator *var12 = &iter12;

        //groups in groups
        bool val3 = groupInGroup(var12);
        if(!val3)
        {
            return false;
        }

        //other att
        ListIterator iter8 = createIterator(group->otherAttributes);

        ListIterator *var8 = &iter8;
        Attribute *otherAtt = nextElement(var8);

        while(otherAtt!=NULL)
        {

            if (otherAtt->name == NULL || otherAtt->value == NULL)
            {
                return false;
            }
            
            otherAtt = nextElement(var8);

        }

        group = nextElement(var7);
    }




    return true;
}

bool groupCircle(ListIterator *var1)//add more checks here(good)
{
    Circle *circle = nextElement(var1);

    while(circle!= NULL)
    {

        if(circle->cx < 0 || circle->cy < 0 || circle->r < 0)
        {
            return false;
        }

        if(circle->units == NULL || circle->otherAttributes== NULL)
        {
            return false;
        }


        ListIterator iter2 = createIterator(circle->otherAttributes);

        ListIterator *var2 = &iter2;
        Attribute *otherAtt = nextElement(var2);


        while(otherAtt!=NULL)
        {

            if (otherAtt->name == NULL || otherAtt->value == NULL)
            {
                return false;
            }

            otherAtt = nextElement(var2);

        }

        circle = nextElement(var1);
    }
    return true;
}

bool groupPath(ListIterator *var5)//add more checks here(good)
{

    Path *path = nextElement(var5);

    while(path!= NULL)
    {

        if(path->data == NULL)//data
        {
            return false;
        }
        //other att
        ListIterator iter6 = createIterator(path->otherAttributes);

        ListIterator *var6 = &iter6;
        Attribute *otherAtt = nextElement(var6);

        while(otherAtt!=NULL)
        {

            if (otherAtt->name == NULL || otherAtt->value == NULL)
            {
                return false;
            }
            
            otherAtt = nextElement(var6);

        }

        path = nextElement(var5);
    }
    return true;
}

bool groupRect(ListIterator *var3)//add more checks here(good)
{
    Rectangle *rect = nextElement(var3);

    while(rect!= NULL)
    {
        if(rect->x < 0 || rect->y < 0 || rect->width < 0 || rect->height < 0)
        {
            return false;
        }
        if(rect->units == NULL|| rect->otherAttributes == NULL)
        {
            return false;
        }

        ListIterator iter4 = createIterator(rect->otherAttributes);

        ListIterator *var4 = &iter4;
        Attribute *otherAtt = nextElement(var4);

        while(otherAtt!=NULL)
        {

            if (otherAtt->name == NULL || otherAtt->value == NULL)
            {
                return false;
            }
            
            otherAtt = nextElement(var4);

        }

        rect = nextElement(var3);
    }
    return true;
}


SVGimage* createSVGimage(char* fileName)//svg parser
{
    xmlDoc *doc = NULL;
    xmlNode *root_element = NULL;

    LIBXML_TEST_VERSION

    doc = xmlReadFile(fileName, NULL, 0);

    if (doc == NULL) 
    {
        xmlFreeDoc(doc);
        xmlCleanupParser();
    
        return NULL;
    }


    root_element = xmlDocGetRootElement(doc);

    SVGimage *svg = createSVG();

    print_element_names(root_element, svg);
    getAttributes (root_element, svg);

    xmlFreeDoc(doc);

    xmlCleanupParser();

    return svg;
}


void deleteSVGimage(SVGimage* img)
{
    if (img == NULL)
    {
        return;
    }

    freeList(img->paths);
    freeList(img->rectangles);
    freeList(img->circles);
    freeList(img->groups);
    freeList(img->otherAttributes);

    free(img);
}

char* SVGimageToString(SVGimage* img)
{
    if (img == NULL)
    {
        return NULL;
    }

    char *printPath = toString(img->paths);
    char *printCircle = toString(img->circles);
    char *printRectangle = toString(img->rectangles);
    char *printGroups = toString(img->groups);
    char *printOther = toString(img->otherAttributes);
    char *string = calloc(1, sizeof(char)*700000);

    // sprintf(string, "\n%s\n%s\n%s\n\t\t\tPath\n%s\n\t\t\tCircle\n%s\n\t\t\tRectangle\n%s\n\t\t\tOther\n%s\n\t\t\tGroups\n%s\n", img->namespace, img->title, img->description, printPath, printCircle, printRectangle, printOther, printGroups);

    sprintf(string, "\n%s\n", img->namespace);

    free(printPath);
    free(printOther);
    free(printCircle);
    free(printRectangle);
    free(printGroups);

    return string;
}

//helper functions
void deleteAttribute( void* data) //to do
{
    if(data == NULL)
    {
        return;
    }

    Attribute *att = (Attribute *)data;

    free(att->name);
    free(att->value);
    free(att);
}
char* attributeToString( void* data)
{
    if (data == NULL)
    {
        return NULL;
    }

    Attribute*att= (Attribute *)data;
    char *string = calloc(1, sizeof(char)*255);

    sprintf(string, "%s: %s\n", att->name, att->value);

    return string;
}//to do
int compareAttributes(const void *first, const void *second)
{
    if (first == NULL || second == NULL)
    {
        return 0;
    }

    

    return 0;
}

void deleteGroup(void* data)
{
    if (data == NULL)
    {
        return;
    }

    Group *group = (Group *)data;

    freeList(group->paths);
    freeList(group->rectangles);
    freeList(group->circles);
    freeList(group->groups);
    freeList(group->otherAttributes);

    free(group);
}
char* groupToString( void* data)
{
    if (data == NULL)
    {
        return NULL;
    }

    Group *group = (Group *)data;

    char *printPath = toString(group->paths);
    char *printCircle = toString(group->circles);
    char *printRectangle = toString(group->rectangles);
    char *printGroups = toString(group->groups);
    char *printOther = toString(group->otherAttributes);

    int length = strlen(printPath) + 10000 + strlen(printGroups);
    char *string = calloc(1, (sizeof(char)*length));

    sprintf(string, "\n\t\t\tGroup Path\n%s\n\t\t\t Group Circle\n%s\n\t\t\t Group Rectangle\n%s\n\t\t\t Group Groups\n%s\n\t\t\t Group Other\n%s\n", printPath, printCircle, printRectangle, printGroups, printOther);

    free(printPath);
    free(printOther);
    free(printCircle);
    free(printRectangle);
    free(printGroups);

    return string;
}
int compareGroups(const void *first, const void *second)
{
    if (first == NULL || second == NULL)
    {
        return 0;
    }

    return 0;
}

void deleteRectangle(void* data)//fix
{
    if (data == NULL)
    {
        return;
    }

    Rectangle *rect = (Rectangle *)data;
    
    freeList(rect->otherAttributes);
    free(rect);
}
char* rectangleToString(void* data)//fix
{

    if (data == NULL)
    {
        return NULL;
    }

    Rectangle *rect = (Rectangle *)data;

    char *string = calloc(1, sizeof(char)*255);
    char *printOther = toString(rect->otherAttributes);

    sprintf(string, "%f\n%f\n%f\n%f\n%s\n\t\t\tOther\n%s\n", rect->x, rect->y, rect->width, rect->height, rect->units, printOther);

    free(printOther);

    return string;
}
int compareRectangles(const void *first, const void *second)//
{
    if (first == NULL || second == NULL)
    {
        return 0;
    }

    

    return 0;
}

void deleteCircle(void* data)//fix
{
    if (data == NULL)
    {
        return;
    }

    Circle *circle = (Circle *)data;
    
    freeList(circle->otherAttributes);
    free(circle);
}
char* circleToString(void* data)//fix
{
    if (data == NULL)
    {
        return NULL;
    }

    Circle *circle = (Circle*)data;

    char *string = calloc(1, sizeof(char)*255);
    char *printOther = toString(circle->otherAttributes);

    sprintf(string, "%f\n%f\n%f\n%s\n\t\t\tCIrcle Other\n%s\n", circle->cx, circle->cy, circle->r, circle->units, printOther);

    free(printOther);

    return string;
}
int compareCircles(const void *first, const void *second)
{
    if (first == NULL || second == NULL)
    {
        return 0;
    }

    return 0;
}

void deletePath(void* data)
{
    if (data == NULL)
    {
        return;
    }

    Path *path = (Path *)data;

    free(path->data);
    freeList(path->otherAttributes);
    free(path);
}
char* pathToString(void* data)
{
    if (data == NULL)
    {
        return NULL;
    }

    Path *path = (Path *)data;
    char *printOther = toString(path->otherAttributes);
    int length = strlen(path->data) + 1000;
    char *string = calloc(1, (sizeof(char)*length));

    sprintf(string, "%s\n\t\t\tOther%s\n", path->data, printOther);

    free(printOther);

    return string;
}
int comparePaths(const void *first, const void *second)
{
    if (first == NULL || second == NULL)
    {
        return 0;
    }



    return 0;
}
void rectHelp(Group * g, List *rectangleList)
 {

    if(g == NULL)
    {
        return;
    }

    
    ListIterator iter = createIterator(g->rectangles);

    ListIterator *var = &iter;
    Rectangle *rect = nextElement(var);

    while(rect != NULL)
    {
        insertBack(rectangleList, var);
        rect = nextElement(var);
    }


    ListIterator newIter = createIterator(g->groups);

    ListIterator *newVar = &newIter;
    Group *newGroup = nextElement(newVar);

    while(newGroup != NULL)
    {
        rectHelp(newGroup,rectangleList);
        newGroup = nextElement(newVar);
    }


}
 
List* getRects(SVGimage* img)//returns a list of all rectangles in a function(if img is Null , return null)
{
    if(img == NULL)
    {
        return NULL;
    }

    List *rectangleList = initializeList(rectangleToString, deleteRectangle, compareRectangles);

    //List *groupList = initializeList(groupToString, deleteGroup, compareGroups);

     if(img->rectangles == NULL && getLength(rectangleList) <= 0)
     {

        return NULL;
     }

     ListIterator iter = createIterator(img->rectangles);

     ListIterator *var = &iter;
     Rectangle *rect = nextElement(var);

      while(rect != NULL)
      {

        insertBack(rectangleList, var);
        rect = nextElement(var);
      }

      //groups


    ListIterator newIter = createIterator(img->groups);

    ListIterator *newVar = &newIter;
    Group *newGroup = nextElement(newVar);


    rectHelp(newGroup,rectangleList);

    newGroup = nextElement(newVar);

    while(newGroup != NULL)
    {
        rectHelp(newGroup,rectangleList);
        newGroup = nextElement(newVar);

    }



   
    return rectangleList;

}

void circleHelp(Group * g, List *circleList)
 {


    if(g == NULL)
    {
        return;
    }

    ListIterator iter = createIterator(g->circles);

    ListIterator *var = &iter;
    Circle *circ = nextElement(var);

    while(circ != NULL)
    {
        insertBack(circleList, var);
        circ = nextElement(var);
    }


    ListIterator newIter = createIterator(g->groups);

    ListIterator *newVar = &newIter;
    Group *newGroup = nextElement(newVar);

    while(newGroup != NULL)
    {
        circleHelp(newGroup,circleList);
        newGroup = nextElement(newVar);
    }


}
List* getCircles(SVGimage* img) //returns a list of all circles in a function  (if img is Null , return null)
{
    if(img == NULL)
    {
        return NULL;
    }

    List *circleList = initializeList(circleToString, deleteCircle, compareCircles);

    if(img->circles == NULL && getLength(circleList) > 0)//img->circles
    {
       return NULL;
    }

    ListIterator iter = createIterator(img->circles);

    ListIterator *var = &iter;
    Circle *circ = nextElement(var);

    while(circ != NULL)
    {

        insertBack(circleList, var);
        circ = nextElement(var);
    }
   //groups


    ListIterator newIter = createIterator(img->groups);

    ListIterator *newVar = &newIter;
    Group *newGroup = nextElement(newVar);

    circleHelp(newGroup,circleList);
    newGroup = nextElement(newVar);

    while(newGroup != NULL)
    {
        circleHelp(newGroup,circleList);
        newGroup = nextElement(newVar);

    }


    return circleList;

}

void groupHelp(Group * g, List *groupList)
 {

    if(g == NULL)

    {
        return;
    }

    ListIterator iter = createIterator(g->groups);

    ListIterator *var = &iter;
    Group *group = nextElement(var);

    while(group != NULL)
    {
        insertBack(groupList, var);
        group = nextElement(var);
    }


    ListIterator newIter = createIterator(g->groups);

    ListIterator *newVar = &newIter;
    Group *newGroup = nextElement(newVar);

    while(newGroup != NULL)
    {
        groupHelp(newGroup,groupList);
        newGroup = nextElement(newVar);
    }


}
List* getGroups(SVGimage* img) //returns a list of all groups in a function  (if img is Null , return null)
{
    if(img == NULL)
    {
        return NULL;
    }


     List *groupList = initializeList(groupToString, deleteGroup, compareGroups);

     if(img->groups == NULL && getLength(groupList) <= 0)
     {

        return NULL;
     }

     ListIterator iter = createIterator(img->groups);

     ListIterator *var = &iter;
     Group *group = nextElement(var);

      while(group != NULL)
      {

        insertBack(groupList, var);
        group = nextElement(var);
      }
   
  //groups


    ListIterator newIter = createIterator(img->groups);

    ListIterator *newVar = &newIter;
    Group *newGroup = nextElement(newVar);

    groupHelp(newGroup,groupList);
    //newGroup = nextElement(newVar);

    // while(newGroup != NULL)
    // {
    //     groupHelp(newGroup,groupList);
    //     newGroup = nextElement(newVar);

    // }


    return groupList;

}
//put helper here 
void pathHelp(Group * g, List *pathList)
 {

    if(g == NULL)
    {
        return;
    }

    
    ListIterator iter = createIterator(g->paths);

    ListIterator *var = &iter;
    Path *path = nextElement(var);

    while(path != NULL)
    {
        insertBack(pathList, var);
        path = nextElement(var);
    }


    ListIterator newIter = createIterator(g->groups);

    ListIterator *newVar = &newIter;
    Group *newGroup = nextElement(newVar);

    while(newGroup != NULL)
    {
        pathHelp(newGroup,pathList);
        newGroup = nextElement(newVar);
    }


}

List* getPaths(SVGimage* img)//returns a list of all paths in a function  (if img is Null , return null)
{
    if(img == NULL)
    {
        return NULL;
    }

    List *pathList = initializeList(pathToString, deletePath, comparePaths);

    if(img->paths == NULL && getLength(pathList) > 0)
    {

       return NULL;
    }

    ListIterator iter = createIterator(img->paths);

    ListIterator *var = &iter;
    Path *path = nextElement(var);


    while(path != NULL)
    {

        insertBack(pathList, var);
        path = nextElement(var);
    }
   //groups

    ListIterator newIter = createIterator(img->groups);

    ListIterator *newVar = &newIter;
    Group *newGroup = nextElement(newVar);

    pathHelp(newGroup,pathList);
    newGroup = nextElement(newVar);

    while(newGroup != NULL)
    {
        pathHelp(newGroup,pathList);
        newGroup = nextElement(newVar);

    }


    return pathList;

}

int numRectsWithArea(SVGimage* img, float area) //returns the num of all rectangles with specified area
{
    if(img == NULL)
    {
        return  0;
    }

    ListIterator iter = createIterator(img->rectangles);
    void *element = NULL;
    float newArea = 0;
    int length = 0;
    float x = 0, y = 0;

    while ((element = nextElement(&iter)) != NULL)
    {
        Rectangle *rect = (Rectangle *)element;

        x = rect->height;
        y = rect->width;
        newArea = ceil(x*y);



            if (newArea == area)
            {
                length++;
            }

            ListIterator newIter = createIterator(img->groups);

            ListIterator *newVar = &newIter;
            Group *newGroup = nextElement(newVar);

            if(newGroup != NULL)
            {
                ListIterator iter1 = createIterator(newGroup->rectangles);//seg fault
                ListIterator *var = &iter1;
                Rectangle *newRect = nextElement(var);

                while(newGroup!= NULL)
                {

                    x = newRect->height;
                    y = newRect->width;
                    newArea = ceil(x*y);

                    if (newArea == area)
                    {
                        length++;
                    }
                    newGroup = nextElement(var);


                }

            }
            
    }


    return length;
}
int numCirclesWithArea(SVGimage* img, float area)//returns the num of all circles with specified area
{

    if(img == NULL)
    {
        return 0;
    }
    int length = 0;


    ListIterator iter = createIterator(img->circles);
    void *element = NULL;
    float newArea = 0;
    float theirVar = 0;

    theirVar = ceil(area);
    float r = 0;

    while ((element = nextElement(&iter)) != NULL)
    {
        Circle *circle = (Circle *)element;


        r = circle->r;

        newArea = ceil(r*r*3.14159265359);

        if (newArea == theirVar)
        {
            length++;
        }


        ListIterator newIter = createIterator(img->groups);

        ListIterator *newVar = &newIter;
        Group *newGroup = nextElement(newVar);


        if(newGroup != NULL)
        {
            ListIterator iter1 = createIterator(newGroup->circles);

            ListIterator *var = &iter1;
        
            Circle *circ = nextElement(var);
    
            while(newGroup!= NULL)
            {

                r = circ->r;

                newArea = ceil(r*r*3.14159265359);

                if (newArea == theirVar)
                {
                    length++;
                }
                newGroup = nextElement(var);


            }
        }
        //add group
    }
    
    return length;

}
int numPathsWithdata(SVGimage* img, char* data)//returns the num of all paths with specified data
{

    if(img == NULL)
    {
        return  0;
    }

    int length = 0;


    ListIterator iter = createIterator(img->paths);
    ListIterator *var = &iter;
    void *element = NULL;


    while ((element = nextElement(&iter)) != NULL)
    {
        Path *p = (Path *)element;
        
        if(strcmp(data, p->data) == 0)
        {
           length++;
        }
        
        p = nextElement(var);

    }

    return length;


}
int numGroupsWithLen(SVGimage* img, int len)//returns the num of all groups with specified length(FIX THIS LATER)
{

    int count = 0;

    if(img == NULL)
    {
        return  0;
    }

    int length = 0;


    ListIterator iter = createIterator(img->groups);
    ListIterator *var = &iter;
    void *element = NULL;


    while ((element = nextElement(&iter)) != NULL)
    {
        Group *g = (Group *)element;
       
        count = groupELementCount(g, count);

        if(len == count)
        {
            length++;
        }
        count = 0;
        g = nextElement(var);

    }

    
    return length;
}
int groupELementCount(Group *g, int count)//count the amount of elements inside group, returns that number
{

    if(g == NULL)
    {
        return 0;
    }

    //groups
    ListIterator iter = createIterator(g->groups);

    ListIterator *var = &iter;
    Group *group = nextElement(var);

    while(group != NULL)
    {
        group = nextElement(var);
        count++;
    }

    //rects
    ListIterator iter1 = createIterator(g->rectangles);

    ListIterator *var1 = &iter1;
    Group *group1 = nextElement(var1);

    while(group1 != NULL)
    {
        group1 = nextElement(var1);
        count++;
    }

    //paths
    ListIterator iter2 = createIterator(g->paths);

    ListIterator *var2 = &iter2;
    Group *group2 = nextElement(var2);

    while(group2 != NULL)
    {
        group2 = nextElement(var2);
        count++;
    }
    //circles
    ListIterator iter3 = createIterator(g->circles);

    ListIterator *var3 = &iter3;
    Group *group3 = nextElement(var3);

    while(group3 != NULL)
    {
        group3 = nextElement(var3);
        count++;
    }


    return count;
}

int numAttr(SVGimage* img) //returns num of attributes in svg image
{
    if(img == NULL)
    {
        return 0;
    }
    int length = 0;

    void *element = NULL;
    
    length = getLength(img->otherAttributes);

    ListIterator iter = createIterator(img->rectangles);

    while ((element = nextElement(&iter)) != NULL)
    {
        Rectangle *rect = (Rectangle *)element;

        length += getLength(rect->otherAttributes);
    }

    iter = createIterator(img->circles);

    while ((element = nextElement(&iter)) != NULL)
    {
        Circle *circle = (Circle *)element;

        length += getLength(circle->otherAttributes);
    }

    iter = createIterator(img->paths);

    while ((element = nextElement(&iter)) != NULL)
    {
        Path *path = (Path *)element;

        length += getLength(path->otherAttributes);
    }

    iter = createIterator(img->groups);

    while ((element = nextElement(&iter)) != NULL)
    {
        Group *group = (Group *)element;

        length += getLength(group->otherAttributes);

        ListIterator rectIter = createIterator(group->rectangles);

        while ((element = nextElement(&rectIter)) != NULL)
        {
            Rectangle *rect = (Rectangle *)element;

            length += getLength(rect->otherAttributes);
        }

        ListIterator pathIter = createIterator(group->paths);

        while ((element = nextElement(&pathIter)) != NULL)
        {
            Path *path = (Path *)element;

            length += getLength(path->otherAttributes);
        }

        ListIterator circleIter = createIterator(group->circles);

        while ((element = nextElement(&circleIter)) != NULL)
        {
            Circle *circle = (Circle *)element;

            length += getLength(circle->otherAttributes);
        }

        ListIterator group2Iter = createIterator(group->groups);

        if ((element = nextElement(&group2Iter)) != NULL)
        {
            /* code */
            countGroupAttributes(group->groups, length);
        }
        // countGroupAttributes(group->groups, length);

        // ListIterator groupIter = createIterator(group->groups);

        // while ((element = nextElement(&groupIter)) != NULL)
        // {
        //     Group *group2 = (Group *)element;

        //     length += getLength(group2->otherAttributes);

        //     countGroupAttributes(group2->groups, length);
        // }
    }

    return length;
}

void countGroupAttributes(List *groups, int length)
{
    ListIterator iter = createIterator(groups);
    void *element = NULL;

    while ((element = nextElement(&iter)) != NULL)
    {
        Group *group = (Group *)element;

        length += getLength(group->otherAttributes);

        ListIterator rectIter = createIterator(group->rectangles);
       

        while ((element = nextElement(&rectIter)) != NULL)
        {
            Rectangle *rect = (Rectangle *)element;

            length += getLength(rect->otherAttributes);
        }

        ListIterator pathIter = createIterator(group->paths);

        while ((element = nextElement(&pathIter)) != NULL)
        {
            Path *path = (Path *)element;

            length += getLength(path->otherAttributes);
        }

        ListIterator circleIter = createIterator(group->circles);

        while ((element = nextElement(&circleIter)) != NULL)
        {
            Circle *circle = (Circle *)element;

            length += getLength(circle->otherAttributes);
        }

        ListIterator group2Iter = createIterator(group->groups);

        if ((element = nextElement(&group2Iter)) != NULL)
        {
            /* code */
            countGroupAttributes(group->groups, length);
        }

        // ListIterator groupIter = createIterator(group->groups);

        // while ((element = nextElement(&groupIter)) != NULL)
        // {
        //     Group *group2 = (Group *)element;

        //     length += getLength(group2->otherAttributes);

        //     countGroupAttributes(group2->groups, length);
        // }
    }
}

/*my helper functions*/


SVGimage* createSVG()
{
    SVGimage *svg = malloc(sizeof(SVGimage));

    svg->rectangles = initializeList(rectangleToString, deleteRectangle, compareRectangles);
    svg->paths = initializeList(pathToString, deletePath, comparePaths);
    svg->circles = initializeList(circleToString, deleteCircle, compareCircles);
    svg->groups = initializeList(groupToString,deleteGroup, compareGroups);
    svg->otherAttributes = initializeList(attributeToString, deleteAttribute, compareAttributes);


    strcpy(svg->namespace, "");
    strcpy(svg->title, "");
    strcpy(svg->description, "");

    return svg;
}
Attribute *createAttribute()//creates attribute(fix this one)
{
    Attribute *attribute = malloc(sizeof(Attribute));

    attribute->name = malloc(sizeof(char)*250);
    attribute->value = malloc(sizeof(char)*250);

    strcpy(attribute->name, "");
    strcpy(attribute->value, "");


    return attribute;
}
Path *createPath()//creates path(here needs fix)
{
    Path *path = malloc(sizeof(Path));

    path->data = malloc(sizeof(char)*(20000 + 1));


    strcpy(path->data, "");

    path->otherAttributes = initializeList(attributeToString, deleteAttribute, compareAttributes);

    return path;
}
void addPathData(Path *path, char *array)
{
    path->data = malloc(sizeof(char)*(strlen(array) + 1));
    // path->data[strlen(array)-1] = '\0';
 
    strcpy(path->data, array);
}
Rectangle *createRectangle()//creates rectangle
{
    Rectangle *rectangles = malloc(sizeof(Rectangle)); 
    
    rectangles->width = 0;
    rectangles->height = 0;
    rectangles->x = 0;
    rectangles->y = 0;
    rectangles->otherAttributes = initializeList(attributeToString, deleteAttribute, compareAttributes);

    strcpy(rectangles->units, "");
    // strcpy(rectangles->units, "");


    return rectangles;
}
Circle *createCircle()//creates circle
{

    Circle *circle = malloc(sizeof(Circle));

    circle->cx = 0;
    circle->cy = 0;
    circle->r = 0;
    strcpy(circle->units, "");
     // strcpy(circle->units, "");

    circle->otherAttributes = initializeList(attributeToString, deleteAttribute, compareAttributes);

    return circle;
}
Group *createGroup()//creates group
{
    Group *group = malloc(sizeof(Group));
    group->rectangles = initializeList(rectangleToString, deleteRectangle, compareRectangles);
    group->paths = initializeList(pathToString, deletePath, comparePaths);
    group->circles = initializeList(circleToString, deleteCircle, compareCircles);
    group->groups = initializeList(groupToString,deleteGroup, compareGroups);
    group->otherAttributes = initializeList(attributeToString, deleteAttribute, compareAttributes);

    return group;
}

void print_element_names(xmlNode * a_node, SVGimage *svg)
{
    xmlNode *cur_node = NULL;
    xmlNodePtr node = NULL;

    for (cur_node = a_node->children; cur_node != NULL; cur_node = cur_node->next) 
    {
        for (node = a_node; node != NULL; node = node->next) //namespace
        {
            strcpy(svg->namespace, (char*)node->ns->href);
        }
        
        if (strcmp((char*)cur_node->name, "g") == 0)//group
        {
            Group *newGroup = createGroup();

            findGroup(cur_node, newGroup); //NEED TO UNCOMMENT AFTER
            insertBack(svg->groups, (void *)newGroup);
        }
        else if (strcmp((char*)cur_node->name, "rect") == 0)
        {
            xmlAttr *attr;

            Rectangle *rectangles = createRectangle();

            for (attr = cur_node->properties; attr != NULL; attr = attr->next)
            {
                xmlNode *value = attr->children;

                char *attrName = (char *)attr->name;
                char *cont = (char *)(value->content);

                if (strcmp(attrName, "x") == 0)
                {

	                if(strstr(cont, "cm") != NULL) 
					{  
	                	strcpy(rectangles->units, "cm");

					}                	
                    float temp;

                    temp = atof((char*)cont);
                    rectangles->x = temp;
                }
                else if (strcmp(attrName, "y") == 0)
                {
					if(strstr(cont, "cm") != NULL) 
					{  
	                	strcpy(rectangles->units, "cm");

					}        
                    float temp;

                    temp = atof((char*)cont);
                    rectangles->y = temp;
                }
                else if (strcmp(attrName, "width") == 0)
                {
					if(strstr(cont, "cm") != NULL) 
					{  
	                	strcpy(rectangles->units, "cm");
					}        
                    float temp;

                    temp = atof((char*)cont);
                    rectangles->width = temp;
                }
                else if (strcmp(attrName, "height") == 0)
                {
					if(strstr(cont, "cm") != NULL) 
					{  
	                	strcpy(rectangles->units, "cm");

					}        
                    float temp;

                    temp = atof((char*)cont);
                    rectangles->height = temp;
                }
                else
                {
                    Attribute *att = createAttribute();

                    strcpy(att->name, attrName);
                    strcpy(att->value, cont);

                    insertBack(rectangles->otherAttributes, (void *)att);
                }
            }

            insertBack(svg->rectangles, (void *)rectangles);
        }
        else if (strcmp((char*)cur_node->name, "path") == 0)
        {
            xmlAttr *attr;

            Path *path = createPath();


    // path->otherAttributes = initializeList(attributeToString, deleteAttribute, compareAttributes);


            for (attr = cur_node->properties; attr != NULL; attr = attr->next)
            {
                xmlNode *value = attr->children;
                char *cont = "";
                char *attrName = "";

                attrName = (char *)attr->name;
                cont = (char *)(value->content);

                if (strcmp(attrName, "d") == 0)
                {
                    free(path->data);
                    // free(path);
                    addPathData(path, cont);
                }
                else
                {
                    Attribute *att = createAttribute();

                    strcpy(att->name, attrName);
                    strcpy(att->value, cont);

                    insertBack(path->otherAttributes, (void *)att);
                }
            }

            insertBack(svg->paths, (void *)path);
        }
        else if (strcmp((char*)cur_node->name, "circle") == 0)//circle
        {
            xmlAttr *attr;

            Circle *circle = createCircle();

            for (attr = cur_node->properties; attr != NULL; attr = attr->next)
            {
                xmlNode *value = attr->children;

                char *attrName = (char *)attr->name;
                char *cont = (char *)(value->content);


                if (strcmp(attrName, "cx") == 0)
                {
					if(strstr(cont, "cm") != NULL) 
					{  
	                	strcpy(circle->units, "cm");
					}        
                    float temp;

                    temp = atof(cont);
                    circle->cx = temp;
                }
                else if (strcmp(attrName, "cy") == 0)
                {
					if(strstr(cont, "cm") != NULL) 
					{  
	                	strcpy(circle->units, "cm");
					}  
                    float temp;

                    temp = atof(cont);
                    circle->cy = temp;
                }
                else if (strcmp(attrName, "r") == 0)
                {
					if(strstr(cont, "cm") != NULL) 
					{  
	                	strcpy(circle->units, "cm");
					}  
                    float temp;

                    temp = atof(cont);
                    circle->r = temp;
                }
                else
                {
                    Attribute *att = createAttribute();

                    strcpy(att->name, attrName);
                    strcpy(att->value, cont);

                    insertBack(circle->otherAttributes, (void *)att);
                }
            }

            insertBack(svg->circles, (void *)circle);
        }
        else if (strcmp((char*)cur_node->name, "title") == 0)
        {
            char temp[256] = "";
            strncpy(temp, (char *)cur_node->children->content, 255);
            strcpy(svg->title, temp);


        }
        else if (strcmp((char*)cur_node->name, "desc") == 0)
        {
            char temp[256] = "";
            strncpy(temp, (char *)cur_node->children->content, 255);
            strcpy(svg->description, temp);

        }
    }
}

void findGroup(xmlNode * cur_node, Group *newGroup)
{
    xmlAttr *attr;

    for (attr = cur_node->properties; attr != NULL; attr = attr->next)
    {
        xmlNode *value = attr->children;

        char *attrName = (char *)attr->name;
        char *cont = (char *)(value->content);

        Attribute *att = createAttribute();
                
        strcpy(att->name, attrName);
        strcpy(att->value, cont);

        insertBack(newGroup->otherAttributes, (void *)att);
    }
    for (cur_node = cur_node->children; cur_node; cur_node = cur_node->next) 
    {
        if (strcmp((char*)cur_node->name, "rect") == 0)
        {
            xmlAttr *attr;

            Rectangle *rectangles = createRectangle();

            for (attr = cur_node->properties; attr != NULL; attr = attr->next)
            {
                xmlNode *value = attr->children;

                char *attrName = (char *)attr->name;
                char *cont = (char *)(value->content);

                if (strcmp(attrName, "x") == 0)
                {
                    float temp;

                    temp = atof(cont);
                    rectangles->x = temp;
                }
                else if (strcmp(attrName, "y") == 0)
                {
                    float temp;

                    temp = atof(cont);
                    rectangles->y = temp;
                }
                else if (strcmp(attrName, "width") == 0)
                {
                    float temp;

                    temp = atof(cont);
                    rectangles->width = temp;
                }
                else if (strcmp(attrName, "height") == 0)
                {
                    float temp;

                    temp = atof(cont);
                    rectangles->height = temp;
                }
                else
                {
                    Attribute *att = createAttribute();

                    strcpy(att->name, attrName);
                    strcpy(att->value, cont);

                    insertBack(rectangles->otherAttributes, (void *)att);
                }
            }

            insertBack(newGroup->rectangles, (void *)rectangles);
        }
        else if (strcmp((char*)cur_node->name, "path") == 0)
        {
            xmlAttr *attr;

            Path *path = createPath();
            // Path *path = malloc(sizeof(Path));


            for (attr = cur_node->properties; attr != NULL; attr = attr->next)
            {
                xmlNode *value = attr->children;
                char *cont = "";
                char *attrName = "";

                attrName = (char *)attr->name;
                cont = (char *)(value->content);

                if (strcmp(attrName, "d") == 0)
                {
                    free(path->data);
                    // free(path);
                    addPathData(path, cont);
                }
                else
                {
                    Attribute *att = createAttribute();

                    strcpy(att->name, attrName);
                    strcpy(att->value, cont);

                    insertBack(path->otherAttributes, (void *)att);
                }
            }

            insertBack(newGroup->paths, (void *)path);

        }
        else if (strcmp((char*)cur_node->name, "circle") == 0)  //circle
        {
            xmlAttr *attr;

            Circle *circle = createCircle();

            for (attr = cur_node->properties; attr != NULL; attr = attr->next)
            {
                xmlNode *value = attr->children;

                char *attrName = (char *)attr->name;
                char *cont = (char *)(value->content);

                if (strcmp(attrName, "cx") == 0)
                {
                    float temp;

                    temp = atof(cont);
                    circle->cx = temp;
                }
                else if (strcmp(attrName, "cy") == 0)
                {
                    float temp;

                    temp = atof(cont);
                    circle->cy = temp;
                }
                else if (strcmp(attrName, "r") == 0)
                {
                    float temp;

                    temp = atof(cont);
                    circle->r = temp;
                }
                else
                {
                    Attribute *att = createAttribute();

                    strcpy(att->name, attrName);
                    strcpy(att->value, cont);

                    insertBack(circle->otherAttributes, (void *)att);
                }
            }

            insertBack(newGroup->circles, (void *)circle);
        }
        else if (strcmp((char*)cur_node->name, "g") == 0)       //newGroup
        {
            Group *group = createGroup();

            findGroup(cur_node, group);
            insertBack(newGroup->groups, (void *)group);
        }
    }
}

void getAttributes (xmlNode *cur_node, SVGimage *svg)
{
    xmlAttr *attr;

            for (attr = cur_node->properties; attr != NULL; attr = attr->next)
            {
                xmlNode *value = attr->children;

                char *attrName = (char *)attr->name;
                char *cont = (char *)(value->content);

                Attribute *att = createAttribute();
                
                strcpy(att->name, attrName);
                strcpy(att->value, cont);

                insertBack(svg->otherAttributes, (void *)att);
            }
}
