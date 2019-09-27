import re
import sys


def check_regular_expression(regexp, string):
	result = re.search(regexp, string)
	if result:
		return True
	else:
		return False
#to_analize = sys.stdin.readline().strip().split(' ')


print check_regular_expression("^The.*Spain$", "The rain in jidsfij Spain")


first_input = open("inputs/input1.txt","r")
current_column = 0
current_row = 0
if first_input.mode == 'r':
	lines_in_input = first_input.readlines()
	for line in lines_in_input:
		words = line.split(' ')
		print words
	print lines_in_input

#print to_analize
