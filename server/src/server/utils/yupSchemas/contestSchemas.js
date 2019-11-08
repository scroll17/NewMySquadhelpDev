const yup = require('yup');

const {
    CONTEST_TYPE,
    CONTEST_STATUS
} = require('../../constants');

const array = yup
    .array()
    .of(yup.string());

const string = yup
    .string()
    .min(1);

const contestType = yup.string().oneOf(Object.values(CONTEST_TYPE));

const price = yup.number().positive().notRequired();

const name = string.notRequired();
const file = string.notRequired();

const type = array.notRequired();
const style = array.notRequired();



const createContestSchema = yup.array().of(
    yup.object({
        contestType: contestType.required(),
        title: string.required(),
        typeOfVenture: string.required(),
        whatVentureDoes: string.required(),
        targetCustomers: string.required(),

        name,
        price,
        type,
        file,
        style,
    })
);

const updateContestSchema = yup.object({
    title: string.notRequired(),
    typeOfVenture: string.notRequired(),
    whatVentureDoes: string.notRequired(),
    targetCustomers: string.notRequired(),

    file,
    type,
    name,
    style,
});

const findContestsSchema = yup.object({
    contestType: array
        .of(contestType)
        .notRequired(),
    id: yup
        .number()
        .notRequired(),
    typeOfVenture: yup
        .string()
        .notRequired(),
    price: yup
        .number()
        .positive()
        .notRequired(),
    status: array
        .of(
            yup.string().oneOf(Object.values(CONTEST_STATUS))
        )
        .notRequired(),
});

module.exports = {
    createContestSchema,
    updateContestSchema,
    findContestsSchema
};