const applicationServerPublicKey =
  "BHOxGfkum0lAatOHgvbj2vTR16DgllMKY3yeorBttl2RfswUbk80dwRgujb2vHkyNtC6ys-KznEknc0KUWbhAiQ";

if ("serviceWorker" in navigator && "PushManager" in window) {
  console.log("Service Worker and Push is supported");

  navigator.serviceWorker
    .register("sw.js")
    .then(function(swReg) {
      console.log("Service Worker is registered", swReg);

      swRegistration = swReg;

      initializeUI();

      if (Notification.permission === "denied") {
        console.log("Permission denied!");
      }
    })
    .catch(function(error) {
      console.error("Service Worker Error", error);
    });
} else {
  console.warn("Push messaging is not supported");
  pushButton.textContent = "Push Not Supported";
}

function initializeUI() {
  // Set the initial subscription value
  swRegistration.pushManager.getSubscription().then(function(subscription) {
    isSubscribed = !(subscription === null);

    if (isSubscribed) {
      console.log("User IS subscribed.");
      updateSubscriptionOnServer(subscription);
    } else {
      console.log("User is NOT subscribed.");
      subscribeUser();
    }
  });
}

function subscribeUser() {
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
  swRegistration.pushManager
    .subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey
    })
    .then(function(subscription) {
      console.log("User is subscribed.");

      console.log(subscription);

      updateSubscriptionOnServer(subscription).catch(
        swRegistration.pushManager
      );

      isSubscribed = true;
    })
    .catch(function(err) {
      console.log("Failed to subscribe the user: ", err);
    });
}

function updateSubscriptionOnServer(subscription) {
  // return fetch("https://backend-qoot.qoot.online/api/subscribe", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json"
  //   },
  //   body: JSON.stringify({ subscription })
  // });
}

function urlB64ToUint8Array(base64String) {
  var padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  var base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");

  var rawData = window.atob(base64);
  var outputArray = new Uint8Array(rawData.length);

  for (var i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
