async function signup(parent, args, context, info) {
    const password = await bcrypt.hash(args.password, 10)
    const user = await context.db.mutation.createUser({
        data: { ...args, password},
    }, `{id}`)
    const token = jwt.sign({userId: user.id}, APP_SECRET)

    return {
        token,
        user,
    }
}

async function login(parent, args, context, info){
    const user = await context.db.query.user({
        where: {email: args.email}
    }, `{ id password}`)
    if(!user){
        throw new Error('no user found')
    }

    const valid = await bcrypt.compare(args.password, user.password)
    if(!valid){
        throw new Error('invalid password');
    }
    
    const token = jwt.sign({userId: user.id}, APP_SECRET)

    return{
        token,
        user
    }
}

module.exports = {
    signup,
    login,
    post,
}