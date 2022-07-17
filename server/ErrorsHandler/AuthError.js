module.exports =class AuthError extends Error{
    message
    status

    constructor(message,status) {
        super()
        this.message=message
        this.status=status
    }

    static UnAuthorizedError(){
        return new AuthError('Вы не авторизованы', 401)
    }


}
