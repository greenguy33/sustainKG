# Welcome to the front end of sustainKG #


### Dependency Installation ###

__Node.js__ 

    Website: https://nodejs.org/en/download/
    
    
    Mac:    brew install node 
    
    Ubuntu: sudo apt-get install nodejs
            
    
__npm__ 

    Mac:    brew install node 
    
    Ubuntu: sudo apt-get install npm

__Vue-cli__

    sudo npm install -g vue-cli


### Set up ###

After install the dependencies mentioned above, go to the file root directory and run the following command:

    sudo npm install 

then start the server by using

    npm run serve 
    
### Docker ###


1.Get Nginx image: (If you did it before, ignore this step):

    sudo docker pull nginx
    
You can check the Nginx image:

    sudo docker images
    
2.Package the vue project:
    
    npm run build
    
You will get a folder dist, and a html file is in it. 


3.We will build the Docker:

1. Dockerfile

Check the content of Dockerfile:
    
    cat Dockerfile
   
Build the docker (note the period):

    sudo docker build -t sustainkg-front .
    
Run the docker:

    nohup sudo docker run --net sustainKGnetwork -d -p 8081:80 sustainkg-front &> nohup_sustainkgfront.out &

Check the docker container:

    sudo docker ps
    
Open the website:

    http://graphdb.ics.uci.edu:8081/
    
#### Enjoy your journey ! ####

### Issue ###

If you meet a problem caused by your host, please run:

    unset HOST
    
then run 

    npm run serve

