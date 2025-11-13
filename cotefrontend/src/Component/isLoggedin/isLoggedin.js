
function isLoggedin() {
    const token = localStorage.getItem("token");
    console.log("token", token);
    if (token === null){
        return(false);

    }else{
        return(true);
    }
}
export default isLoggedin;