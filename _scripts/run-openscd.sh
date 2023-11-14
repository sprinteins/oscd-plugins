FILE="$(pwd)/../openscd/"

if lsof -Pi :8080 -sTCP:LISTEN -t > /dev/null ; then 
    echo "port is already in use!"
    exit 1
fi

if [ -d "$FILE" ]; then
    (cd $FILE; npm start)
else
    echo "$FILE is a NOT directory."
fi