#!/usr/bin/env bash

echo "================================================================================"
echo "CURL DETAILED PROTOCOL & NETWORK PROBE"
echo "================================================================================"

test_endpoint() {
  local name="$1"
  local url="$2"
  echo ""
  echo ">>> TESTING: $name ($url)"
  curl -k -s -L --max-time 10 -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36" \
    -w "HTTP_CODE: %{http_code}\nFINAL_URL: %{url_effective}\nREDIRECT_COUNT: %{num_redirects}\nTIME_TOTAL: %{time_total}s\nCONTENT_TYPE: %{content_type}\nSIZE_DOWNLOAD: %{size_download}b\n" \
    -o /tmp/curl_body.txt "$url"
  
  head -n 20 /tmp/curl_body.txt
  echo "--- Table rows count: $(grep -i -c '<tr' /tmp/curl_body.txt || echo 0)"
  echo "--- .pdf links count: $(grep -i -c '\.pdf' /tmp/curl_body.txt || echo 0)"
  echo "--- <a> links count: $(grep -i -c '<a ' /tmp/curl_body.txt || echo 0)"
}

# 1. Central 1: SSC
test_endpoint "SSC Configured" "https://ssc.gov.in/notices"
test_endpoint "SSC Homepage" "https://ssc.gov.in"
test_endpoint "SSC API Notices" "https://ssc.gov.in/api/notices"

# 2. Central 2: UPSC
test_endpoint "UPSC Configured" "https://upsc.gov.in/recruitment/recruitment-advertisement"
test_endpoint "UPSC Active Exams" "https://upsc.gov.in/examinations/active-exams"
test_endpoint "UPSC Recruitment Advt" "https://www.upsc.gov.in/recruitment/recruitment-advertisement"
test_endpoint "UPSC Apply Online" "https://upsconline.nic.in"

# 3. State 1: BPSC
test_endpoint "BPSC Configured HTTPS" "https://bpsc.bih.nic.in/notices"
test_endpoint "BPSC Root HTTPS" "https://bpsc.bih.nic.in"
test_endpoint "BPSC Root HTTP" "http://bpsc.bih.nic.in"
test_endpoint "BPSC New Domain" "https://bpsc.bihar.gov.in"
test_endpoint "BPSC Online Portal" "https://onlinebpsc.bihar.gov.in"

# 4. State 2: UPPSC
test_endpoint "UPPSC Configured" "https://uppsc.up.nic.in/all-notifications"
test_endpoint "UPPSC All Notifications ASPX" "https://uppsc.up.nic.in/CandidatePages/Notifications.aspx"
test_endpoint "UPPSC Root" "https://uppsc.up.nic.in"

# 5. Major Source: CSBC Bihar & IBPS
test_endpoint "CSBC Bihar Configured" "https://csbc.bihar.gov.in/notices"
test_endpoint "CSBC Bihar Root" "https://csbc.bihar.gov.in"
test_endpoint "CSBC Advt List" "https://csbc.bihar.gov.in/Advt/AdvtList.aspx"
test_endpoint "IBPS Careers" "https://www.ibps.in/careers"
test_endpoint "IBPS Root" "https://www.ibps.in"

