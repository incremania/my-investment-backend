const createTokenUser = (user) => {
  return {
    firstName: user.firstname,
    lastName: user.lastname,
    email: user.email,
    userName: user.username,
    userId: user._id,
    role: user.role,
    phone: user.phone,
    balance: user.balance,
    referralCode: user.referralCode,
    referralCount: user.referralCount,
    investmentType: user.investmentType,
    profit: user.profit,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    referedBy: user.referedBy
  };
};

module.exports = createTokenUser;
