*** Settings ***
Documentation       Simple example using SeleniumLibrary.

Library             SeleniumLibrary
Resource            keywords.resource

Suite Setup         Open Application
Suite Teardown      Close Application


*** Test Cases ***
Base Test
    [Documentation]    Base Test
    Fill Username Field
