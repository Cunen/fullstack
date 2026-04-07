*** Settings ***
Documentation       Simple example using SeleniumLibrary.

Library             SeleniumLibrary
Library             CustomLibrary.py
Variables           variables.py


*** Keywords ***
Open Application
    [Documentation]    Open the application
    Open Browser    ${URL}    ${BROWSER}

Close Application
    [Documentation]    Close the application
    Close Browser

Fill Username Field
    [Documentation]    Fill and check username input
    ${choice}    Get Random Choice
    Wait Until Page Contains Element    id=username
    Input Text    id=username    ${choice}
    Textfield Value Should Be    id=username    ${choice}
