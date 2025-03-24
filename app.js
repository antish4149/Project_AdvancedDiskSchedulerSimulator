document.getElementById("simulate").addEventListener("click", () => {
    const diskRequests = document.getElementById("diskRequests").value
      .split(",")
      .map(Number);
    const initialHead = parseInt(document.getElementById("initialHead").value);
    const algorithm = document.getElementById("algorithm").value;
  
    if (diskRequests.includes(NaN) || isNaN(initialHead)) {
      alert("Please enter valid inputs.");
      return;
    }
  
    let result;
    switch (algorithm) {
      case "fcfs":
        result = simulateFCFS(diskRequests, initialHead);
        break;
      case "sstf":
        result = simulateSSTF(diskRequests, initialHead);
        break;
      case "scan":
        result = simulateSCAN(diskRequests, initialHead, "scan");
        break;
      case "cscan":
        result = simulateSCAN(diskRequests, initialHead, "cscan");
        break;
      default:
        alert("Invalid algorithm selected!");
        return;
    }
  
    displayResults(result);
  });
  
  function simulateFCFS(requests, head) {
    let totalMovement = 0;
    const sequence = [head, ...requests];
    for (let i = 0; i < requests.length; i++) {
      totalMovement += Math.abs(sequence[i + 1] - sequence[i]);
    }
    return { sequence, totalMovement };
  }
  
  function simulateSSTF(requests, head) {
    let totalMovement = 0;
    const sequence = [head];
    let remainingRequests = [...requests];
  
    while (remainingRequests.length > 0) {
      const currentHead = sequence[sequence.length - 1];
      const closestRequest = remainingRequests.reduce((prev, curr) =>
        Math.abs(curr - currentHead) < Math.abs(prev - currentHead) ? curr : prev
      );
      totalMovement += Math.abs(closestRequest - currentHead);
      sequence.push(closestRequest);
      remainingRequests = remainingRequests.filter((req) => req !== closestRequest);
    }
    return { sequence, totalMovement };
  }
  
  function simulateSCAN(requests, head, type) {
    const sortedRequests = requests.sort((a, b) => a - b);
    const left = sortedRequests.filter((req) => req < head);
    const right = sortedRequests.filter((req) => req >= head);
  
    let sequence, totalMovement;
    if (type === "scan") {
      sequence = [head, ...right, ...left.reverse()];
    } else if (type === "cscan") {
      sequence = [head, ...right, ...left, head];
    }
    totalMovement = calculateMovement(sequence);
    return { sequence, totalMovement };
  }
  
  function calculateMovement(sequence) {
    let totalMovement = 0;
    for (let i = 1; i < sequence.length; i++) {
      totalMovement += Math.abs(sequence[i] - sequence[i - 1]);
    }
    return totalMovement;
  }
  
  function displayResults({ sequence, totalMovement }) {
    const chart = document.getElementById("chart");
    chart.innerHTML = "";
    sequence.forEach((pos) => {
      const div = document.createElement("div");
      div.className = "gantt-bar";
      div.style.width = "40px";
      div.textContent = pos;
      chart.appendChild(div);
    });
  
    document.getElementById("total-movement").textContent = `Total Head Movement: ${totalMovement}`;
    document.getElementById("average-seek-time").textContent = `Average Seek Time: ${(totalMovement / sequence.length).toFixed(2)}`;
  }
  