import { baseApi } from "@/redux/baseApi";

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation({
            query: (userInfo) => ({
                url: "/riders/register",
                method: "POST",
                data: userInfo,
            }),
        }),
        login: builder.mutation({
            query: (userInfo) => ({
                url: "/auth/login",
                method: "POST",
                data: userInfo,
            }),
        })
    }),
});

export const {
    useRegisterMutation,
    useLoginMutation
} = authApi;