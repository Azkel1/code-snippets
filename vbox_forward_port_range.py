# Script to forward port ranges in a VBox NAT network
# Created by Alexis Santana Cano - 13/01/2021
# TODO: Instead of asking for the NAT network name get all the existing ones and show a menu

import os
import sys
import re
import subprocess

# REGEX patterns 
PROTOCOL = re.compile(r"(TCP\b)|(UDP\b)", re.I)
IP = re.compile(r"^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$", re.I | re.M)
VBOXMANAGE_OUT = re.compile(r"\w+:\b(?:tcp|udp)\b:\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\]:\d{1,5}:\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\]:\d{1,5}", re.I | re.M)
RULE_NAME = re.compile(r"^\w+", re.I)
YES_NO = re.compile(r"\b(?:yes|y|n|no)\b", re.I)

def create_range():
    _rule_protocol, _host_ip, _guest_ip, _port_range_start, _port_range_end = "", "", "", 0, 0

    try:
        # Ask for each value 
        _natnetwork_name = input(" Enter the NAT network name: ").strip()
        _rule_name = input(" Enter the rule name: ").strip()
        
        while not PROTOCOL.match(_rule_protocol):   # Check if its "TCP" or "UDP"
            _rule_protocol = input(" Enter the rule protocol to be used (TCP | UDP): ")

        while not IP.match(_host_ip) or not check_valid_ip(_host_ip):   # Check if its a valid IP
            _host_ip = input(" Enter the host machine IP: ").strip()

        while not IP.match(_guest_ip) or not check_valid_ip(_guest_ip): # Check if its a valid IP
            _guest_ip = input(" Enter the VM IP: ").strip()

        while _port_range_start > 65535 or _port_range_start <= 0:   # Check if its valid port
            _port_range_start = int(input(" Enter starting port: ").strip())

        while _port_range_end > 65535 or _port_range_end <= 0:   # Check if its valid port
            _port_range_end = int(input(" Enter ending port: ").strip())
    
        for current_port in range(_port_range_start, _port_range_end + 1):
            os.system(f"VBoxManage natnetwork modify --netname {_natnetwork_name} --port-forward-4 \"{_rule_name}_{current_port}:{_rule_protocol}:[{_host_ip}]:{current_port}:[{_guest_ip}]:{current_port}\"")

    except KeyboardInterrupt:
        print(" Back to the menu then!")

def check_valid_ip(ip):
    if ip:
        for n in ip.split("."):
            if int(n) > 255 or int(n) < 0:
                return False
        return True
    else:
        return False

def remove_range():
    rules_list = []
    confirmation_check = ""
    
    # Obtain all natnets info and split when theres a line in between text, this is where one net info ends and another starts. This allows us to filter only rules in this net, just in case theres a rule with the same name in other net.
    natnets = str(subprocess.check_output("vboxmanage list natnets")).split("\\r\\n\\r\\n")
    net_name = input(" From which NAT Network do you wanna remove rules?: ")
    natnets = [s for s in natnets if net_name in s][0]
    
    # Now we can search in the previous string for rules that match what the user inputs
    rule_search = input(" Enter the name of the rules that you want to delete: ").strip()

    for rule in VBOXMANAGE_OUT.findall(natnets):
        rules_list.append(RULE_NAME.findall(rule)[0])

    # Search for rules that contain the text input by the user
    rule_matches = [s for s in rules_list if rule_search in s]
    if not rule_matches:
        print(f" There isn't any rules that contain \"{rule_search}\"")
    else:
        print(f"""    
        {len(rule_matches)} matches that contain \"{rule_search}\": {', '.join([str(i) for i in rule_matches])}""")

    # We ask the user for confirmation, just in case
    while not confirmation_check:
        confirmation_check = YES_NO.match(input(" Are you sure you want to delete these rules? (y/n): "))
        
    if confirmation_check:
        for i in rule_matches:
            os.system(f"VBoxManage natnetwork modify --netname {net_name} --port-forward-4 delete {i}")
    else:
        return

os.system("cls")
while True:
    try: 
        _menu = int(input("""\n Welcome!\n\n\t1.Create a port forwarding rule\n\t2.Remove existing rule(s)\n\t3.Exit\n\n Choose an option: """).strip())

        if _menu == 1:
            create_range()
        elif _menu == 2:
            remove_range()
        elif _menu == 3:
            sys.exit(" Bye!")
        else:
            os.system("cls")
            print(" Choose one of the options below!")

    except KeyboardInterrupt:
        sys.exit("\n Bye!")
