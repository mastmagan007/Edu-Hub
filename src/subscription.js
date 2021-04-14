function urlBase64ToUint8Array(base64String) {
    // eslint-disable-next-line
    const padding = "=".repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/")

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

const publicVapidKey=urlBase64ToUint8Array("***REMOVED***");

function sendSubscription(subscription) {
    console.log(subscription);
  return fetch(`localhost:4000/notification/subscribe`, {
    method: 'POST',
    body: JSON.stringify(subscription),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDczMDcwMjExMTI1ZjI0Mjg3OGVkYjEiLCJpYXQiOjE2MTg0NDA4NzAsImV4cCI6MTYxODUyNzI3MH0.EoCCazvYJPsHMbCFf5rVChv8vEkysL-O3mU6dpGq25Q'
    }
  })
}

export function subscribeUser() {
    try{
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then(function(registration) {
              if (!registration.pushManager) {
                console.log('Push manager unavailable.')
                return
              }
        
              registration.pushManager.getSubscription().then(function(existedSubscription) {
                if (existedSubscription === null) {
                  console.log('No subscription detected, make a request.')
                  registration.pushManager.subscribe({
                    applicationServerKey: publicVapidKey,
                    userVisibleOnly: true,
                  }).then(function(newSubscription) {
                    console.log('New subscription added.')
                    sendSubscription(newSubscription)
                  }).catch(function(e) {
                    if (Notification.permission !== 'granted') {
                      console.log('Permission was not granted.')
                    } else {
                      console.error('An error ocurred during the subscription process.', e)
                    }
                  })
                } else {
                  console.log('Existed subscription detected.')
                  sendSubscription(existedSubscription)
                }
              })
            })
              .catch(function(e) {
                console.error('An error ocurred during Service Worker registration.', e)
              })
          }
    } catch(e){
        console.log(e);
    }
}

export default subscribeUser;