import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Exercise Library - FitFlow",
  description: "Browse and search through our comprehensive exercise library",
};

export default function Exercises() {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col">
      <main className="flex-1 pb-24">
        {/* Header */}
        <div className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between sticky top-0 z-10">
          <h1 className="text-slate-900 dark:text-white text-2xl font-bold leading-tight tracking-[-0.015em] flex-1">Exercise Library</h1>
          <div className="text-slate-900 dark:text-white flex size-12 shrink-0 items-center justify-end">
            <span className="material-symbols-outlined text-2xl">tune</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 py-3">
          <label className="flex flex-col min-w-40 h-12 w-full">
            <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
              <div className="text-slate-400 dark:text-slate-400 flex bg-white dark:bg-slate-800/50 items-center justify-center pl-4 rounded-l-xl border-r-0">
                <span className="material-symbols-outlined">search</span>
              </div>
              <input
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-slate-900 dark:text-white focus:outline-0 focus:ring-0 border-none bg-white dark:bg-slate-800/50 focus:border-none h-full placeholder:text-slate-400 dark:placeholder:text-slate-400 px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                placeholder="Search exercises..."
              />
            </div>
          </label>
        </div>

        {/* Category Filters */}
        <div className="flex gap-3 px-4 py-3 overflow-x-auto">
          <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full bg-gradient-to-r from-primary-start to-primary-end px-4 shadow-md">
            <p className="text-white text-sm font-medium leading-normal">All</p>
          </button>
          <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white dark:bg-slate-800/50 px-4">
            <p className="text-slate-900 dark:text-white text-sm font-medium leading-normal">Chest</p>
          </button>
          <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white dark:bg-slate-800/50 px-4">
            <p className="text-slate-900 dark:text-white text-sm font-medium leading-normal">Legs</p>
          </button>
          <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white dark:bg-slate-800/50 px-4">
            <p className="text-slate-900 dark:text-white text-sm font-medium leading-normal">Cardio</p>
          </button>
          <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white dark:bg-slate-800/50 px-4">
            <p className="text-slate-900 dark:text-white text-sm font-medium leading-normal">Bodyweight</p>
          </button>
          <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white dark:bg-slate-800/50 px-4">
            <p className="text-slate-900 dark:text-white text-sm font-medium leading-normal">Back</p>
          </button>
        </div>

        {/* Exercise Grid */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-4 p-4">
          <div
            className="bg-cover bg-center flex flex-col gap-3 rounded-xl justify-end p-4 aspect-square"
            style={{backgroundImage: 'linear-gradient(0deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 60%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuDhLti84qtZI7D6FUucd_WW-PrrO-0yW8PpYTdcyN-nrM9Kpd7otOVx-0Hx4yKa-IefTgsjyjwJbHWeHavJtERjmfJtYeBq4FWUyrnXxHrnzTl34wE_Z443N-ddsD3TTGwYVX-zk5bD_1diIy5JlUzrW1FxvASMpoX3Gy8tq6ry6IU6TrzIIpK-BwhxlF2wa0ehXsSSVjfIgcvKvRyEJQOx8v3AP1-sXVFzeTEC70EPeWsGnjUXQKpT3nNEoobJBpiM8gV26Ac7OSo")'}}
          >
            <p className="text-white text-base font-bold leading-tight line-clamp-2">Dumbbell Bench Press</p>
          </div>

          <div
            className="bg-cover bg-center flex flex-col gap-3 rounded-xl justify-end p-4 aspect-square"
            style={{backgroundImage: 'linear-gradient(0deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 60%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuAYWeSOwOKsqpttZLJH91C39LcPHSRYKlLJWI-G59BucFDj1rtIAMj8B6JMwUFRaD33mteOsUi_mHGjjeGdeAfRZC22ka3Dvkxhkh-Xi9boRVoMDlw1Fk506bq5cuwxSroibK_-xCpczUbbyQRthYG4IiCMY10HtniNckapajl-D93bm7VXwjfp3zT_nr_UCkKwKouFJVT7i-YdmXXqS9RddZBmFYD1TpmW0cPuZPLr7_RT8xL-0ddnGmKCu5BosiaLH1SaYEzoDE4")'}}
          >
            <p className="text-white text-base font-bold leading-tight line-clamp-2">Barbell Squat</p>
          </div>

          <div
            className="bg-cover bg-center flex flex-col gap-3 rounded-xl justify-end p-4 aspect-square"
            style={{backgroundImage: 'linear-gradient(0deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 60%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuD4vDDXfLeE1b88rYya8pyK0_xfs9-FfGVLTrzIhMJliHnwKi8DDf5a_BWEJULJ59eSpAx1HWOP0E-2nj1DsNbO9zkez9GQecpI-TRyVX1ihbYlZe4CUY37ekj0qW-N6K3drmxikrRLLQMzCRFRfYURImo6FKmadHU-xX_Tixt5HAokTQ-hnkWMwb0gZeofvK4XdzdTd1aExOa-OdSr_vEfyk1XzrecQ-sheelT_6L6pW0-vcbmlhDEqXv4nxL1kaL5xQYFdlHU6aI")'}}
          >
            <p className="text-white text-base font-bold leading-tight line-clamp-2">Deadlift</p>
          </div>

          <div
            className="bg-cover bg-center flex flex-col gap-3 rounded-xl justify-end p-4 aspect-square"
            style={{backgroundImage: 'linear-gradient(0deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 60%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuColZKF7FnxXjqO4h4b_jTWE9-cyI-vQ4pq_qLv6sgJ_mSd4bR7QfExVdf9dF7SMYJQZaiWUeZ12O5vA3-K_fzdnCcyRWZ-x3eLd8q8oSGDpPNmL_pCloON4SC1HZFFZnqw63Qn6jhiQ2Eqj6uKfmAuEJOm_OgJ62Fwiu7ouxnKcjope70L0UWMbZShDI_mIymg9Gf2VETxptLgcyP9lv1UMLL_TiBKHf9nlNsipBQAzljPjTT8j518OiWFOay3R0yQyeZF_anThkM")'}}
          >
            <p className="text-white text-base font-bold leading-tight line-clamp-2">Overhead Press</p>
          </div>

          <div
            className="bg-cover bg-center flex flex-col gap-3 rounded-xl justify-end p-4 aspect-square"
            style={{backgroundImage: 'linear-gradient(0deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 60%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuCVZTcRe4fVvFjnjuf3X1FkvBO0CrU7rx6f_57vbs0f5w0ENoZSMK4kWpxuOy_pFuhigEA79lRNgf24MrC3HMAV0jzRGHRa2Nhnpmd0sAz5hkHDM6Q55U8-E_u_U4unDmJoIVy2SNXDOoo_yH6d7CQKU47KHeI4mGmjWqnyUdQuFIuMAXDJPCITyg5_kmJORmb_4I6GiWbBbzprNC9F7czw6xVn6iepFnTY2op7pyZlB8CAbtnjVfQVt8RIyy7ao2JoHhdmqgpgiVo")'}}
          >
            <p className="text-white text-base font-bold leading-tight line-clamp-2">Push Up</p>
          </div>

          <div
            className="bg-cover bg-center flex flex-col gap-3 rounded-xl justify-end p-4 aspect-square"
            style={{backgroundImage: 'linear-gradient(0deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 60%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuBqdaD6VPRo8_gjekf91qGR3kb270ZVTA4Z2GbZCGGVzfz39HXHS_bEIuHspQCxlGtvcDOrOgM7KNEVBMA7M9NEHYGEtDBTn2KC-IIuqh-Jn15KnsY3BVT4Xu1x3yvRLzLYli56rTwg_chTV7Hge8pzDcvfOWoho182AdBDlc3N3eQM9NqmuyZXlknX-J1XpypsfVq92hvbRunm-lP8DKh4YnV_Chv6E8-WxMCSieCQM3MUmcUuriFtYD80Jn3d-Y8anCZzyHGr2Mg")'}}
          >
            <p className="text-white text-base font-bold leading-tight line-clamp-2">Plank</p>
          </div>

          <div
            className="bg-cover bg-center flex flex-col gap-3 rounded-xl justify-end p-4 aspect-square"
            style={{backgroundImage: 'linear-gradient(0deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 60%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuCqJm9CAJPJfouLBYehE5312uVFzZxo6OW2cfOIdxOyKVl_MIbSUUw8Duqlp_RqzYQlop7ouOVz45b_NWgFn6g7Gax_LdMx6zJpcbXXDmXBZJkpmWjTYaoyIDn9UwrB9ixSmHHoYI5lp34qrbeNLGmP2FefsYTB6163q3B2E2WGN-SA_xP53ZiS0wU39u3rIdKoTqg9MSp8ZNfUNhyMvcapFnnTQ5QjDBh87TR_VnUiQU0shCHSqEQo-6RrVOQ4EBi8XxKGphi-bLw")'}}
          >
            <p className="text-white text-base font-bold leading-tight line-clamp-2">Treadmill Run</p>
          </div>

          <div
            className="bg-cover bg-center flex flex-col gap-3 rounded-xl justify-end p-4 aspect-square"
            style={{backgroundImage: 'linear-gradient(0deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 60%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuCwlB_2NQaSHTBn4pw_ltL9QMO0mjCyFQhPZMEnsTbHj2qJIV-vrsYxj8drwSCz5f1e7Kq3oYCOYhMcBT2PtC49o37b544hYKrlfk30_ft9B1lYbqO2cYnNGq5FbpoV3bDQOIdRlcH4UUclAixrIvrqetnqk87pCQO48pKy1pOZbwQFZ2zcyCdk0iOTP4aqumGwAaCVKfMbkmwR99_NUci_4Ld_veb9myMkEf4fsNzpArKcZ8d6lCpTq7ZmP1gMLULHA7iVM8Z3BBw")'}}
          >
            <p className="text-white text-base font-bold leading-tight line-clamp-2">Lunges</p>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0">
        <div className="flex gap-2 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 backdrop-blur-sm px-4 pb-3 pt-2">
          <a className="flex flex-1 flex-col items-center justify-end gap-1 text-slate-500 dark:text-slate-400" href="/">
            <div className="flex h-8 items-center justify-center">
              <span className="material-symbols-outlined">home</span>
            </div>
            <p className="text-xs font-medium leading-normal tracking-[0.015em]">Home</p>
          </a>
          <a className="flex flex-1 flex-col items-center justify-end gap-1 text-slate-500 dark:text-slate-400" href="/workouts">
            <div className="flex h-8 items-center justify-center">
              <span className="material-symbols-outlined">fitness_center</span>
            </div>
            <p className="text-xs font-medium leading-normal tracking-[0.015em]">Workouts</p>
          </a>
          <a className="flex flex-1 flex-col items-center justify-end gap-1" href="/exercises">
            <div className="flex h-8 items-center justify-center">
              <span className="material-symbols-outlined text-transparent bg-clip-text bg-gradient-to-r from-primary-start to-primary-end">import_contacts</span>
            </div>
            <p className="text-transparent bg-clip-text bg-gradient-to-r from-primary-start to-primary-end text-xs font-medium leading-normal tracking-[0.015em]">Library</p>
          </a>
          <a className="flex flex-1 flex-col items-center justify-end gap-1 text-slate-500 dark:text-slate-400" href="/progress">
            <div className="flex h-8 items-center justify-center">
              <span className="material-symbols-outlined">person</span>
            </div>
            <p className="text-xs font-medium leading-normal tracking-[0.015em]">Profile</p>
          </a>
        </div>
      </div>
    </div>
  );
}
