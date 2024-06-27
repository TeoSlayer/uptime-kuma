# Report for Assignment 1

## Project chosen

Name: uptime-kuma

URL: https://github.com/TeoSlayer/uptime-kuma

Number of lines of code and the tool used to count it: 98k, cloc

Programming language: JS

## Coverage measurement

### Existing tool

The existing tool is a custom one and the coverage is 0 because they do end2end

<Show the coverage results provided by the existing tool with a screenshot>

### Your own coverage tool

<The following is supposed to be repeated for each group member>

<Group member name>

<Function 1 name>

<Show a patch (diff) or a link to a commit made in your forked repository that shows the instrumented code to gather coverage measurements>

<Provide a screenshot of the coverage results output by the instrumentation>

<Function 2 name>

<Provide the same kind of information provided for Function 1>

## Coverage improvement

The coverage improvements to each branch were 100% by our tool and by their tool was 18.22 branch because of the reason explained from above.

### Individual tests

<The following is supposed to be repeated for each group member>

<Group member name>

### Test 1: Bark File

-   **Test Results**:  
    ![Bark Test Results](/images/bark-test.jpg "Bark Test Results")

-   **New Coverage Results**:  
    ![Bark Coverage Results](/images/bark-cov.jpg "Bark Coverage Results")

### Test 2: Wecom File

-   **Test Results**:  
    ![Wecom Test Results](/images/wecom-test.jpg "Wecom Test Results")

-   **New Coverage Results**:  
    ![Wecom Coverage Results](/images/wecom-cov.jpg "Wecom Coverage Results")

### Test 3: Teams File

-   **Test Results**:  
    ![Teams Test Results](/images/teams-test.jpg "Teams Test Results")

-   **New Coverage Results**:  
    ![Teams Coverage Results](/images/teams-cov.jpg "Teams Coverage Results")

### Test 4: Extra File

-   **Extra Results**:  
    ![Extra Coverage Before Update](/images/extra-test.jpg "Extra Coverage Before")

-   **Extra Coverage Results**:  
    ![Extra Coverage After Update](/images/extra-cov.jpg "Extra Coverage After")

### All tests

![All tests](/images/tests-all.jpg "All tests")

### Overall

![Coverage Results Before Update](/images/before.jpg "Coverage Results Before")

_Figure 1: Coverage results before the update_

![Coverage Results After Update](/images/after.jpg "Coverage Results After")

_Figure 2: Coverage results after the update_

## Statement of individual contributions

Traian: I did the tests for the bark file.

Maxime: I did the tests from Teams.js for the getStyle and statusMessageFactory functions

Teo: I did the tests for util-server.js

Nicu: I did the tests for wecom.js and teams.js, the function \_notificationPayloadFactory
