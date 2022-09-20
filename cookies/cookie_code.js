<!-- Global site tag (gtag.js) - Google Analytics -->
<script type = "text/plain" data-cookiecategory="analytics" async src="https://www.googletagmanager.com/gtag/js?id=G-LQESH4RG0W"></script>
<script type = "text/plain" data-cookiecategory="analytics">
    window.dataLayer = window.dataLayer || [];
    function gtag(){window.dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-LQESH4RG0W');

    async function digestMessage(message) {
        const msgUint8 = new TextEncoder().encode(message);                           // encode as (utf-8) Uint8Array
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);           // hash the message
        const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
        return hashHex;
    }

    async function setUserID() {
        const user_email = WIKI.$store.get('user/email')
        if (user_email) {
            USER_ID = await digestMessage(user_email)

            // Associate with inbuilt user id
            gtag('config', 'G-LQESH4RG0W', {
                'user_id': USER_ID
            });

            // Associate with custom user id dimension to expose it to us during analysis
            gtag('set', 'user_properties', {
                user_id_dimension: USER_ID
            });
        }
    }

    async function setUserCohortYear() {
        const user_email = WIKI.$store.get('user/email')
        if (user_email) {
            const COHORT_YEAR = user_email.match(/(\d{2})@/)[1]

            gtag('set', 'user_properties', {
                cohort_year: COHORT_YEAR
            });
        }
    }

        setUserID();
        setUserCohortYear();
window.addEventListener("load", function () {
console.log("checking");
        setUserCohortYear();
        setUserID();
    });
</script>

<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orestbida/cookieconsent@v2.8.6/dist/cookieconsent.css
" media="print" onload="this.media='all'">

<script src="https://cdn.jsdelivr.net/gh/orestbida/cookieconsent@v2.8.6/dist/cookieconsent.js"></script>

<script src = "https://cdn.jsdelivr.net/gh/Imperial-Wiki/consent-config@87d6343a65f7ff424fdea7c0b98eee6256e101cf/cookieconsent-init.js"> </script>
