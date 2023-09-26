CC=g++

main: build_dir randomizer

build_dir:
	if [ ! -d build ]; then mkdir build; fi;

randomizer:
	$(CC) src/randomizer.cpp -o build/randomizer

clean:
	rm -rf build/ && echo "Option - A\nOption - B\nOption - C\nOption - D" > src/spinItemsInput.txt